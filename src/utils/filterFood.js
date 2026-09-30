import { getEffectivePrice } from "./formatPrice";

export const filterFoodList = (foods, filters) => {
  let result = [...foods];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (f) =>
        f.name?.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q) ||
        f.ingredients?.some((i) => i.toLowerCase().includes(q))
    );
  }

  if (filters.category && filters.category !== "All") {
    result = result.filter((f) => f.category === filters.category);
  }

  if (filters.priceRange) {
    result = result.filter((f) => {
      const price = getEffectivePrice(f);
      switch (filters.priceRange) {
        case "under100": return price < 100;
        case "100-250": return price >= 100 && price <= 250;
        case "250-500": return price >= 250 && price <= 500;
        case "above500": return price > 500;
        default: return true;
      }
    });
  }

  if (filters.vegFilter === "veg") result = result.filter((f) => f.isVeg);
  if (filters.vegFilter === "nonveg") result = result.filter((f) => !f.isVeg);

  if (filters.availableOnly) result = result.filter((f) => f.isAvailable !== false);

  switch (filters.sort) {
    case "price_asc":
      result.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
      break;
    case "price_desc":
      result.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
      break;
    case "rating":
      result.sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
      break;
    case "newest":
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "popular":
    default:
      result.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
      break;
  }

  return result;
};
