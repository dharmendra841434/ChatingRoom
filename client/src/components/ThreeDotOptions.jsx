import React, { useEffect, useRef } from "react";

const ThreeDotOptions = ({
  isOpen,
  setIsOpen,
  userId,
  groupOwnerId,
  handleDelete,
}) => {
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <>
      {isOpen && (
        <div
          ref={ref}
          className="absolute top-10  right-10 mt-2 w-48 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          <ul className="">
            <li className="px-4 py-2 transition-all ease-in-out duration-300 hover:bg-purple-200 cursor-pointer">
              Info
            </li>
            {/* <li className="px-4 py-2 transition-all ease-in-out duration-300 hover:bg-purple-200 cursor-pointer">
              See Users
            </li> */}
            {userId === groupOwnerId && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 w-full flex justify-start transition-all ease-in-out duration-300 hover:bg-purple-200 cursor-pointer"
              >
                Delete
              </button>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default ThreeDotOptions;
