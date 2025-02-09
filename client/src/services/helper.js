export function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export const getChatRoomId = (pathname) => {
  const segments = pathname?.split("/"); // Split by '/'
  return segments.length > 2 ? segments[2] : null; // Extract the ID
};

export const timeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);

  if (diffInSeconds < 60) return `Just now`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};

export function getRandomHexColor() {
  // Generate random values for Red, Green, and Blue (RGB)
  const r = Math.floor(Math.random() * 256); // 0 to 255
  const g = Math.floor(Math.random() * 256); // 0 to 255
  const b = Math.floor(Math.random() * 256); // 0 to 255

  // Convert each value to a two-digit hexadecimal string and concatenate
  const hexColor = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  return hexColor;
}

export function getInitials(fullName) {
  return fullName
    ?.split(" ") // Split the name into words
    ?.map((word) => word?.charAt(0)?.toUpperCase()) // Get first letter of each word and uppercase it
    ?.join(""); // Join them together
}

export const hasUserReadLastMessage = (group, user) => {
  const userId = user?._id;
  if (!group?.messages?.length || !userId) {
    return false; // No messages or userId provided
  }
  const lastMessage = group.messages[group.messages.length - 1];

  return lastMessage?.read?.includes(userId) ? true : false;
};
