import { baseURL } from "./BaseURL";

export const getImageUrl = (imageUrl) => {
  // Check if the imageUrl is empty
  if (!imageUrl || imageUrl.trim() === "") {
    return "..."; // or return a placeholder image URL
  }

  // Check if the imageUrl starts with "http"
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  } else {
    return `${baseURL}${imageUrl}`;
  }
};
