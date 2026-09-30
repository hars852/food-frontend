import { createContext, useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const guestCartBeforeAuth = useRef(null);
  const url = "http://localhost:4000";
  const [token, setTokenState] = useState(() => localStorage.getItem("token") || "");
  const [customer, setCustomer] = useState(null);
  const [food_list, setFoodList] = useState([]);
  const [popularFoods, setPopularFoods] = useState([]);
  const [specialFoods, setSpecialFoods] = useState([]);
  const [offers, setOffers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsSummary, setReviewsSummary] = useState({ averageRating: 0, totalReviews: 0 });
  const [gallery, setGallery] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCartData = async (authToken) => {
    try {
      const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token: authToken } });
      if (response.data.success) setCartItems(response.data.cartItems || []);
    } catch (error) {
      console.error("Cart load error:", error);
    }
  };

  const fetchFoodList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) setFoodList(response.data.data);
  };

  const fetchHomeData = async () => {
    try {
      const [popular, specials, offersRes, reviewsRes, summaryRes, galleryRes, restaurantRes, catRes] =
        await Promise.all([
          axios.get(`${url}/api/food/popular?limit=8`),
          axios.get(`${url}/api/food/specials`),
          axios.get(`${url}/api/offers`),
          axios.get(`${url}/api/reviews?limit=6`),
          axios.get(`${url}/api/reviews/summary`),
          axios.get(`${url}/api/gallery`),
          axios.get(`${url}/api/restaurant/info`),
          axios.get(`${url}/api/food/categories`),
        ]);

      if (popular.data.success) setPopularFoods(popular.data.data);
      if (specials.data.success) setSpecialFoods(specials.data.data);
      if (offersRes.data.success) setOffers(offersRes.data.data);
      if (reviewsRes.data.success) setReviews(reviewsRes.data.data);
      if (summaryRes.data.success) setReviewsSummary(summaryRes.data.data);
      if (galleryRes.data.success) setGallery(galleryRes.data.data);
      if (restaurantRes.data.success) setRestaurantInfo(restaurantRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
    } catch (error) {
      console.error("Home data fetch error:", error);
    }
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await Promise.all([fetchFoodList(), fetchHomeData()]);
      setLoading(false);
    }
    loadData();
  }, []);

  const setToken = (nextToken) => {
    if (nextToken) localStorage.setItem("token", nextToken);
    else localStorage.removeItem("token");
    setTokenState(nextToken || "");
  };

  useEffect(() => {
    if (!token) { setCustomer(null); return; }
    let active = true;
    Promise.all([
      axios.get(`${url}/api/user/profile`, { headers: { token } }),
      axios.post(`${url}/api/cart/get`, {}, { headers: { token } }),
    ]).then(([profile, cart]) => {
      if (!active) return;
      if (profile.data.success) setCustomer(profile.data.data);
      if (cart.data.success) setCartItems(cart.data.cartItems || []);
    }).catch((error) => {
      if (!active) return;
      if (error.response?.status === 401) setToken("");
    });
    return () => { active = false; };
  }, [token]);

  const syncGuestCart = async (authToken) => {
    const guestItems = [...cartItems];
    if (guestCartBeforeAuth.current === null) guestCartBeforeAuth.current = guestItems;
    if (!guestItems.length) return;
    try {
      for (const item of guestItems) {
        await axios.post(`${url}/api/cart/add`, {
          itemId: item.foodId,
          quantity: item.quantity,
          selectedAddons: item.selectedAddons || [],
          specialInstructions: item.specialInstructions || "",
        }, { headers: { token: authToken } });
      }
    } catch (error) {
      console.error("Unable to merge guest cart:", error.message);
    }
  };

  const login = async (credentials) => {
    const response = await axios.post(`${url}/api/user/login`, credentials);
    if (!response.data.success) throw new Error(response.data.message || "Unable to sign in.");
    await syncGuestCart(response.data.token);
    setToken(response.data.token);
    return response.data;
  };

  const register = async (account) => {
    const response = await axios.post(`${url}/api/user/register`, account);
    if (!response.data.success) throw new Error(response.data.message || "Unable to create your account.");
    await syncGuestCart(response.data.token);
    setToken(response.data.token);
    return response.data;
  };

  const logout = () => {
    setToken("");
    setCustomer(null);
    setCartItems(guestCartBeforeAuth.current || []);
    guestCartBeforeAuth.current = null;
    setAppliedCoupon(null);
  };

  const addToCart = async (itemId, quantity = 1, selectedAddons = [], specialInstructions = "") => {
    const food = food_list.find((f) => f._id === itemId);
    if (!food || food.isAvailable === false) return;

    const basePrice = food.isSpecial && food.specialPrice ? food.specialPrice : food.price;
    const addonTotal = selectedAddons.reduce((s, a) => s + a.price, 0);
    const unitPrice = basePrice + addonTotal;
    const addonKey = selectedAddons.map((a) => a.name).sort().join("|");
    const cartKey = `${itemId}__${addonKey}__${specialInstructions.trim()}`;

    let updated = [...cartItems];
    const idx = updated.findIndex((i) => i.cartKey === cartKey);
    if (idx >= 0) {
      updated[idx] = {
        ...updated[idx],
        quantity: updated[idx].quantity + quantity,
        totalPrice: updated[idx].unitPrice * (updated[idx].quantity + quantity),
      };
    } else {
      updated.push({
        cartKey,
        foodId: itemId,
        name: food.name,
        image: food.image,
        basePrice,
        quantity,
        selectedAddons,
        specialInstructions,
        unitPrice,
        totalPrice: unitPrice * quantity,
      });
    }

    setCartItems(updated);

    if (token) {
      await axios.post(
        `${url}/api/cart/add`,
        { itemId, quantity, selectedAddons, specialInstructions },
        { headers: { token } }
      );
    }
  };

  const removeFromCart = async (cartKey) => {
    const updated = [...cartItems];
    const idx = updated.findIndex((i) => i.cartKey === cartKey);
    if (idx >= 0) {
      if (updated[idx].quantity <= 1) {
        updated.splice(idx, 1);
      } else {
        updated[idx].quantity -= 1;
        updated[idx].totalPrice = updated[idx].unitPrice * updated[idx].quantity;
      }
    }
    setCartItems(updated);

    if (token) {
      await axios.post(`${url}/api/cart/remove`, { cartKey }, { headers: { token } });
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (token) {
      await axios.post(`${url}/api/cart/clear`, {}, { headers: { token } });
    }
  };

  const getTotalCartAmount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  }, [cartItems]);

  const getCartItemCount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const validateCoupon = async (code) => {
    const response = await axios.post(`${url}/api/offers/validate`, {
      couponCode: code,
      orderAmount: getTotalCartAmount(),
    });
    if (response.data.success) {
      setAppliedCoupon(response.data.data);
      return response.data.data;
    }
    throw new Error(response.data.message);
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
    getCartItemCount,
    url,
    token,
    setToken,
    customer,
    login,
    register,
    logout,
    loadCartData,
    popularFoods,
    specialFoods,
    offers,
    reviews,
    reviewsSummary,
    gallery,
    restaurantInfo,
    categories,
    searchQuery,
    setSearchQuery,
    appliedCoupon,
    setAppliedCoupon,
    validateCoupon,
    loading,
    fetchFoodList,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
