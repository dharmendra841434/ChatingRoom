import { FaGooglePlay, FaApple } from "react-icons/fa";

const DownloadAppBanner = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-blue-100 p-6 rounded-2xl shadow-md text-center">
      <h2 className="text-xl font-bold mb-2">Download Our App</h2>
      <p className="text-gray-600 mb-4">
        Get the best experience by downloading our app from the Play Store or
        App Store.
      </p>
      <div className="flex space-x-4">
        <a
          href="https://play.google.com/store"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800"
        >
          <FaGooglePlay className="mr-2" /> Play Store
        </a>
        <a
          href="https://www.apple.com/app-store/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800"
        >
          <FaApple className="mr-2" /> App Store
        </a>
      </div>
    </div>
  );
};

export default DownloadAppBanner;
