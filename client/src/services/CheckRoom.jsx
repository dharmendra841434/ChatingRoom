async function checkRoom(roomKey) {
  try {
    const response = await fetch(
      `http://localhost:8000/check-room?roomKey=${encodeURIComponent(roomKey)}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    //kidfyeufe

    return result.isExist;
  } catch (error) {
    console.error("Error checking room:", error);
    return { error, status: false };
  }
}

export default checkRoom;
