import { useState } from 'react';
import { ArrowLeftOnRectangleIcon, UserCircleIcon, MagnifyingGlassIcon, ChatBubbleBottomCenterTextIcon, CalendarIcon, FolderIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../App/hooks';
import { logout } from '../../slicers/authentification/auth-slice';

export default function Navbar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isMenuOpen, setMenuOpen] = useState(false);
  
    const iconeClass = 'h-8 w-8 hover:text-blue-500 transition-colors duration-200';
  
    const handleLogout = () => {
      dispatch(logout());
      navigate('/login');
    };
  
    return (
      <nav className="bg-white p-4 flex justify-between items-center border-b-2 border-gray-300">
        <div className="tablet:hidden">
          <Bars3Icon className="h-10 w-10" onClick={() => setMenuOpen(!isMenuOpen)} />
          {isMenuOpen && (
            <div className="tablet:hidden absolute left-0 bg-white p-4">
                <div className="flex flex-col space-y-4">
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
                        Home
                    </NavLink>
                    <NavLink to="/chat" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
                        Chat
                    </NavLink>
                    <NavLink to="/calendar" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
                        Calendar
                    </NavLink>
                    <NavLink to="/drive" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
                        Drive
                    </NavLink>
                    <NavLink to="/profile" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
                        Profile
                    </NavLink>
                </div>
            </div>
        )}
        </div>
        <div className="hidden tablet:flex space-x-4">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
            <img src="/logo.svg" alt="logo" className="h-10 w-10" />
          </NavLink>
          <NavLink
            to="/chat"
            className={({ isActive }) => (isActive ? 'text-blue-600' : '')}
          >
            <ChatBubbleBottomCenterTextIcon className={iconeClass} />
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) => (isActive ? 'text-blue-600' : '')}
          >
            <CalendarIcon className={iconeClass} />
          </NavLink>
          <NavLink to="/drive" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
            <FolderIcon className={iconeClass} />
          </NavLink>
        </div>
        <div className="hidden tablet:flex items-center rounded-full bg-gray-200 px-3 py-1 w-1/3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          <input className="ml-2 bg-transparent focus:outline-none w-full" placeholder="Rechercher" />
        </div>
        <div className="tablet:flex space-x-4">
          <div className="hidden tablet:flex space-x-4">
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
              <UserCircleIcon className={iconeClass} />
            </NavLink>
          </div>
          <button onClick={handleLogout}>
            <ArrowLeftOnRectangleIcon className={iconeClass} />
          </button>
        </div>
        <div className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
              Home
            </NavLink>
            <NavLink to="/chat" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
              Chat
            </NavLink>
            <NavLink
              to="/calendar"
              className={({ isActive }) => (isActive ? 'text-blue-600' : '')}
            >
              Calendar
            </NavLink>
            <NavLink to="/drive" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
              Drive
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
              Profile
            </NavLink>
            <button onClick={handleLogout} className="mt-4">
              Logout
            </button>
          </div>
      </nav>
    );
  }
  