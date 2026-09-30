import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import FoodCard from "../../components/FoodCard/FoodCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import EmptyState from "../../components/EmptyState/EmptyState";
import Dropdown from "../../components/common/Dropdown";
import "./Menu.css";
import "./MenuControls.css";

const MenuPage = () => {
  const { food_list, categories, loading, searchQuery, setSearchQuery, url } = useContext(StoreContext);
  const [filters, setFilters] = useState({ category: "All", priceRange: "", vegFilter: "", availableOnly: false, sort: "popular" });
  const [foods, setFoods] = useState(food_list);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState("");
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const clearFilters = () => { setFilters({ category: "All", priceRange: "", vegFilter: "", availableOnly: false, sort: "popular" }); setSearchQuery(""); };
  const queryParams = useMemo(() => {
    const value = searchQuery.trim();
    const params = { sort: filters.sort, search: value !== "" && !Number.isNaN(Number(value)) ? Number(value) : value };
    if (filters.category !== "All") params.category = filters.category;
    if (filters.vegFilter) params.isVeg = filters.vegFilter === "veg";
    if (filters.availableOnly) params.available = true;
    if (filters.priceRange === "under100") params.priceMax = 100;
    if (filters.priceRange === "100-250") { params.priceMin = 100; params.priceMax = 250; }
    if (filters.priceRange === "250-500") { params.priceMin = 250; params.priceMax = 500; }
    if (filters.priceRange === "above500") params.priceMin = 500;
    return params;
  }, [filters, searchQuery]);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setMenuLoading(true);
      setMenuError("");
      try {
        const response = await axios.get(`${url}/api/food/list`, { params: queryParams, signal: controller.signal });
        if (response.data.success) setFoods(response.data.data || []);
        else { setFoods([]); setMenuError("Unable to load search results. Please try again."); }
      } catch (error) {
        if (error.name !== "CanceledError") { setFoods([]); setMenuError("Unable to load search results. Please try again."); }
      } finally { if (!controller.signal.aborted) setMenuLoading(false); }
    }, searchQuery ? 300 : 0);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [url, queryParams, searchQuery]);

  const categoryOptions = [{ value: "All", label: "All categories" }, ...categories.map((category) => ({ value: category, label: category }))];
  const priceOptions = [{ value: "", label: "Any price" }, { value: "under100", label: "Under ₹100" }, { value: "100-250", label: "₹100–₹250" }, { value: "250-500", label: "₹250–₹500" }, { value: "above500", label: "Above ₹500" }];
  const dietOptions = [{ value: "", label: "Veg & non-veg" }, { value: "veg", label: "Veg" }, { value: "nonveg", label: "Non-veg" }];
  const sortOptions = [{ value: "popular", label: "Popular" }, { value: "price_asc", label: "Price: low to high" }, { value: "price_desc", label: "Price: high to low" }, { value: "rating", label: "Rating" }, { value: "newest", label: "Newest" }];
  return <main className="menu-page"><div className="menu-heading"><h1>Our Menu</h1><p>Freshly made dishes for every craving.</p></div><section className="menu-filters" aria-label="Menu filters"><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search food, ingredients, or category" aria-label="Search menu" /><Dropdown value={filters.category} onChange={(value) => update("category", value)} options={categoryOptions} ariaLabel="Filter by category" /><Dropdown value={filters.priceRange} onChange={(value) => update("priceRange", value)} options={priceOptions} ariaLabel="Filter by price" /><Dropdown value={filters.vegFilter} onChange={(value) => update("vegFilter", value)} options={dietOptions} ariaLabel="Filter by food type" /><Dropdown value={filters.sort} onChange={(value) => update("sort", value)} options={sortOptions} ariaLabel="Sort foods" /><label><input type="checkbox" checked={filters.availableOnly} onChange={(event) => update("availableOnly", event.target.checked)} /> Available only</label></section>{loading || menuLoading ? <LoadingSpinner message={searchQuery.trim() ? "Searching..." : "Loading menu..."} /> : menuError ? <EmptyState message={menuError} /> : foods.length ? <div className="food-grid menu-grid">{foods.map((food) => <FoodCard key={food._id} food={food} />)}</div> : <EmptyState message={searchQuery.trim() ? "No results found. Try searching for another food." : "No dishes match these filters"} actionLabel="Clear filters" onAction={clearFilters} />}</main>;
};
export default MenuPage;
