const ChatImage = ({ mediaFile }) => {
  if (mediaFile) {
    // Check if the mediaFile is a URL (string)
    if (typeof mediaFile === "string") {
      console.log(typeof mediaFile, "this is url");
      return <img src={mediaFile} alt="Uploaded URL" className=" h-28 w-28" />;
    }

    // If it's a local file (File object), use URL.createObjectURL
    if (mediaFile instanceof File) {
      return (
        <img
          src={URL.createObjectURL(mediaFile)}
          alt="Local File"
          className=" h-28 w-28"
        />
      );
    }
  }
  return null;
};

export default ChatImage;
