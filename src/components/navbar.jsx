import React from "react";
import { NavLink } from "react-router-dom";

const navbar = () => {
  return (
    <nav className="flex justify-between bg-slate-700 text-white py-2">
      <div className="logo">
        <span className="font-bold text-xl mx-8">ScheduleTracker</span>
      </div>
      <ul className="flex gap-6 mx-4">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-red-400 cursor-pointer hover:font-bold transition-all"
              : "cursor-pointer hover:font-bold transition-all"
          }
          to="/"
        >
          <li>Home</li>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-red-400 cursor-pointer hover:font-bold transition-all"
              : "cursor-pointer hover:font-bold transition-all"
          }
          to="/logout"
        >
          <li>Log Out</li>
        </NavLink>
      </ul>
    </nav>
  );
};

export default navbar;
