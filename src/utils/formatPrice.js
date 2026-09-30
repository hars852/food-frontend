export const formatPrice = (amount) => {
  return `₹${Number(amount || 0).toFixed(0)}`;
};

export const getEffectivePrice = (food) => {
  if (!food) return 0;
  if (food.isSpecial && food.specialPrice && food.specialValidUntil) {
    const valid = new Date(food.specialValidUntil) >= new Date();
    if (valid) return food.specialPrice;
  }
  return food.price;
};

export const getDiscountPercent = (food) => {
  if (!food?.isSpecial || !food.specialPrice) return 0;
  return Math.round(((food.price - food.specialPrice) / food.price) * 100);
};
