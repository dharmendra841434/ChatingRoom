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

export const createUserObjects = (currentUser, targetUser) => {
  // Destructure currentUser
  const {
    _id: cId,
    full_name: cFullName,
    username: cUsername,
    profile_pic: cProfilePic,
    isActive: cIsActive,
    friends: cFriends,
  } = currentUser;
  const cUser = {
    _id: cId,
    full_name: cFullName,
    username: cUsername,
    profile_pic: cProfilePic,
    isActive: cIsActive,
    friends: cFriends,
  };

  // Destructure targetUser
  const {
    _id: tId,
    full_name: tFullName,
    username: tUsername,
    profile_pic: tProfilePic,
    isActive: tIsActive,
    friends: tFriends,
  } = targetUser;
  const tUser = {
    _id: tId,
    full_name: tFullName,
    username: tUsername,
    profile_pic: tProfilePic,
    isActive: tIsActive,
    friends: tFriends,
  };

  // Return both cUser and tUser
  return { cUser, tUser };
};
