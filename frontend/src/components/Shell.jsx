import React from "react";

const Shell = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#020617]">
      
      {/* Background Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse"></div>

      {/* The Glowing Border Frame */}
      <div className="relative z-10 p-0.5 rounded-[3rem] bg-gradient-to-b from-blue-500/50 to-purple-500/50 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
        <div className="rounded-[2.9rem] overflow-hidden bg-[#0b1120] flex flex-col items-center justify-center border border-white/5">
          {/* This is where the LoginPage content sits */}
          <div className="relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shell;