// Import essential modules
import uploader from "../../configs/uploader.config.js";

export const avatarUpload = uploader(
  "avatars",
  ["image/jpeg", "image/jpg", "image/png"],
  10000000,
  "Only .jpeg .jpg & .png file are allowed"
);
