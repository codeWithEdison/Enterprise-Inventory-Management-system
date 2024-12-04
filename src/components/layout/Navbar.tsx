// src/components/layout/NavBar.tsx
import React, { useState, useEffect, useRef } from "react";
import { AiOutlineLogout, AiOutlineMenu } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { TbArrowsDiagonalMinimize2 } from "react-icons/tb";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from '../../store';
import { logout } from "../../features/auth/authSlice";
import useAuth from "../../hooks/useAuth";
import { NotificationDropdown } from "../notifications/NotificationDropdown";
// import UR_LOGO from "../../assets/images/ur-logo.png";

interface NavBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (status: boolean) => void;
}

const NavBar: React.FC<NavBarProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const [viewUser, setViewUser] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setViewUser(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setViewUser(false);
    dispatch(logout());
  };

  return (
    <div className="bg-white text-black py-1 pl-3 fixed top-0 right-0 left-0 z-50 border-b shadow-sm">
      <div className="flex flex-row items-center justify-between gap-3">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-primary-100 rounded-md p-2 cursor-pointer hover:bg-primary-300 
                      focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? (
              <TbArrowsDiagonalMinimize2 className="text-2xl text-primary-800 animate__animated animate__zoomIn" />
            ) : (
              <AiOutlineMenu className="text-2xl text-primary-800 animate__animated animate__fadeIn" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <img src='/logo.png' alt="UR Logo" className="w-10 md:w-12" />
            <span className="text-gray-700 font-bold text-sm md:text-base hidden sm:block">
              UR HG STOCK
            </span>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center mr-2" ref={userMenuRef}>
        <NotificationDropdown />
          <button
            onClick={() => setViewUser(!viewUser)}
            className="flex items-center gap-2 bg-primary-blue-white hover:bg-primary-100 
                      py-2 pl-3 pr-1 rounded-md transition-all duration-200"
            aria-expanded={viewUser}
          >
            <div className="rounded-full flex items-center justify-center bg-gray-400 
                          group-hover:bg-primary-800 text-white h-8 w-8">
              <FaUserCircle className="text-2xl" />
            </div>
            <span className="text-sm hidden sm:block pr-2">
              {user?.firstName} {user?.lastName}
            </span>
            <IoIosArrowDown className={`text-xl text-primary-800 transition-transform duration-200 
                                    ${viewUser ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {viewUser && (
            <div className="absolute top-full right-0 mt-1 w-screen sm:w-64 
                          bg-white rounded-b-lg sm:rounded-lg shadow-lg border border-gray-200 
                          animate__animated animate__fadeIn animate__faster">
              {/* Mobile User Info */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <FaUserCircle className="text-4xl text-gray-400" />
                  <div>
                    <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                    <div className="text-sm text-gray-500">{user?.userRoles?.[0]?.role.name}</div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <Link
                  to="/profile"
                  onClick={() => setViewUser(false)}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                >
                  <FaUserCircle className="text-xl text-primary-600" />
                  <span>Profile</span>
                </Link>

                <Link
                  to="/change-password"
                  onClick={() => setViewUser(false)}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                >
                  <RiLockPasswordLine className="text-xl text-primary-600" />
                  <span>Change Password</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 p-2 text-left text-red-600 
                            rounded-md hover:bg-red-50 mt-2"
                >
                  <AiOutlineLogout className="text-xl" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;