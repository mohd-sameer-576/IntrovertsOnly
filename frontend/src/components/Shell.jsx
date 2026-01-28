import React from "react";

const Shell = ({ children }) => {
  return (
    <div className="flex items-center justify-center">

      <div className="rounded-3xl overflow-hidden flex p-[2px] animate-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[length:300%_300%]">
        {/* Inner Box */}
        {children}
      </div>
    </div>
  );
};

export default Shell;
