import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

function PasswordInput({ title = "Password", setPassword, password = "" }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      <label className="block mb-2 text-gray-700">{title}</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-foreground outline-none mb-4"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-gray-500"
        >
          {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;
