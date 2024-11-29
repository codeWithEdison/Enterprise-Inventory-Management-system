
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setSidebarOpen } from '../../features/layout/layoutSlice';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state: RootState) => state.layout);

  const handleSidebarToggle = (open: boolean) => {
    dispatch(setSidebarOpen(open));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={handleSidebarToggle}
      />

      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={handleSidebarToggle}
      />

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        sidebarOpen ? 'md:ml-64' : ''
      }`}>
        <div className="p-4">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => handleSidebarToggle(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;