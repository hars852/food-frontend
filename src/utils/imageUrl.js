export const imageUrl = (url, image) =>
  image?.startsWith("data:") ? image : `${url}/images/${image || ""}`;
