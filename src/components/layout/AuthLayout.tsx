import { Outlet } from "react-router-dom";
import Footer from "./Footer";
// import EimsLogo from "../common/EimsLogo";

const AuthLayout = () => {
  return (
    <div className="bg-gray-100 h-screen ">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {/* <img src="/logo.png" alt="UR Logo" className="h-12 w-auto" /> */}
                {/* <EimsLogo className="h-12 w-auto" /> */}
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Enterprise Inventory  & Requests Mangamenet  system </h1>
                {/* <p className="text-sm text-gray-500">Nyarugenge Campus</p> */}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className=" max-w-lg  mx-auto px-4 py-16">
        <div>
          <Outlet />
        </div>
      </div>
      <div className=" fixed bottom-0 w-full ">
        <Footer />
      </div>
    </div>
  );
};

export default AuthLayout;
