import React from "react";
import { IoCloudDownloadOutline } from "react-icons/io5";

const ChatImage = ({ mediaFile }) => {
  const handleDownload = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (mediaFile) {
    // If the mediaFile is a URL (string)
    if (typeof mediaFile === "string") {
      return (
        <div className="relative">
          <img src={mediaFile} alt="Uploaded URL" className="h-28 w-28" />
          <button
            onClick={() => handleDownload(mediaFile, "downloaded-image.png")}
            className="absolute bottom-0 right-0 "
          >
            <IoCloudDownloadOutline className=" text-xl transition-all duration-300 ease-in-out hover:scale-110 text-purple-900" />
          </button>
        </div>
      );
    }

    // If the mediaFile is a local File object
    if (mediaFile instanceof File) {
      const imageUrl = URL.createObjectURL(mediaFile);
      return (
        <div className="relative">
          <img src={imageUrl} alt="Local File" className="h-28 w-28" />
        </div>
      );
    }
  }

  return null;
};

export default ChatImage;
