import { useContext, useMemo, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import FoodCard from "../../components/FoodCard/FoodCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import EmptyState from "../../components/EmptyState/EmptyState";
import Select from "../../components/common/Select";
import { filterFoodList } from "../../utils/filterFood";
import "./Menu.css";
import "./MenuControls.css";

const Menu = () => {
  const { food_list, categories, loading, searchQuery, setSearchQuery } = useContext(StoreContext);
  const [filters, setFilters] = useState({ category: "All", priceRange: "", vegFilter: "", availableOnly: false, sort: "popular" });
  const foods = useMemo(() => filterFoodList(food_list, { ...filters, search: searchQuery }), [food_list, filters, searchQuery]);
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return <main className="menu-page">
    <div className="menu-heading"><h1>Our Menu</h1><p>Freshly made dishes for every craving.</p></div>
    <section className="menu-filters" aria-label="Menu filters">
      <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search food, ingredients, or category" aria-label="Search menu" />
      <Select value={filters.category} onChange={(e) => update("category", e.target.value)}><option value="All">All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</Select>
      <select value={filters.priceRange} onChange={(e) => update("priceRange", e.target.value)}><option value="">Any price</option><option value="under100">Under ₹100</option><option value="100-250">₹100–₹250</option><option value="250-500">₹250–₹500</option><option value="above500">Above ₹500</option></select>
      <Select value={filters.vegFilter} onChange={(e) => update("vegFilter", e.target.value)}><option value="">Veg & non-veg</option><option value="veg">Veg</option><option value="nonveg">Non-veg</option></Select>
      <Select value={filters.sort} onChange={(e) => update("sort", e.target.value)}><option value="popular">Popular</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option><option value="rating">Rating</option><option value="newest">Newest</option></Select>
      <label><input type="checkbox" checked={filters.availableOnly} onChange={(e) => update("availableOnly", e.target.checked)} /> Available only</label>
    </section>
    {loading ? <LoadingSpinner message="Loading menu..." /> : foods.length ? <div className="food-grid menu-grid">{foods.map((food) => <FoodCard key={food._id} food={food} />)}</div> : <EmptyState message="No dishes match these filters" actionLabel="Clear filters" onAction={() => { setFilters({ category: "All", priceRange: "", vegFilter: "", availableOnly: false, sort: "popular" }); setSearchQuery(""); }} />}
  </main>;
};
export default Menu;
