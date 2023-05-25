import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
    ArrowLeftOnRectangleIcon,
    UserCircleIcon,
    MagnifyingGlassIcon,
    ChatBubbleBottomCenterTextIcon,
    CalendarIcon,
    FolderIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAppDispatch } from '../../App/hooks';
import { logout } from '../../slicers/authentification/auth-slice';

export default function Navbar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const iconeTransistion = 'hover:text-blue-500 transition-colors duration-200 space-x-4 flex flex-col items-center';
    const iconeSize = 'h-8 w-8 tablet:h-10 tablet:w-10';

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function classNames(...classes: any) {
        return classes.filter(Boolean).join(' ');
    }

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white p-4 flex justify-between items-center border-b-2 border-gray-300">
            <div className="tablet:hidden">
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button
                            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-50"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <XMarkIcon className=" h-5 w-5 text-gray-400" aria-hidden="true" />
                            ) : (
                                <Bars3Icon className=" h-5 w-5 text-gray-400" aria-hidden="true" />
                            )}
                        </Menu.Button>
                    </div>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            to="/"
                                            className={classNames(
                                                active ? 'bg-blue-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-base',
                                            )}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Home
                                        </Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            to="/chat"
                                            className={classNames(
                                                active ? 'bg-blue-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-base',
                                            )}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Chat
                                        </Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            to="/calendar"
                                            className={classNames(
                                                active ? 'bg-blue-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-base',
                                            )}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Calendar
                                        </Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            to="/drive"
                                            className={classNames(
                                                active ? 'bg-blue-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-base',
                                            )}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Drive
                                        </Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            to="/profil"
                                            className={classNames(
                                                active ? 'bg-blue-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-base',
                                            )}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
            <div className="hidden tablet:flex space-x-4">
                <NavLink to="/" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
                    <img src="/logo.svg" alt="logo" className="h-16 w-16" />
                </NavLink>
                <NavLink to="/chat" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
                    <div className={iconeTransistion}>
                        <ChatBubbleBottomCenterTextIcon className={iconeSize} />
                        <p className="flex text-sm w-full">Chat</p>
                    </div>
                </NavLink>
                <NavLink to="/calendar" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
                    <div className={iconeTransistion}>
                        <CalendarIcon className={iconeSize} />
                        <p className="flex text-sm w-full">Calendar</p>
                    </div>
                </NavLink>
                <NavLink to="/drive" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
                    <div className={iconeTransistion}>
                        <FolderIcon className={iconeSize} />
                        <p className="flex text-sm w-full">Drive</p>
                    </div>
                </NavLink>
            </div>
            <div className="tablet:hidden items-center">
                <p className="text-blue-600 text-2xl">Sensonord</p>
            </div>
            <div className="hidden tablet:flex items-center rounded-full bg-gray-200 px-3 py-2 w-1/3 cursor-not-allowed">
                <MagnifyingGlassIcon className="h-61 w-6 text-gray-500" />
                <input
                    disabled
                    className="ml-2 bg-transparent focus:outline-none w-full text-lg cursor-not-allowed"
                    placeholder="Rechercher"
                />
            </div>
            <div className="tablet:flex space-x-4">
                <div className="hidden tablet:flex space-x-4">
                    <NavLink to="/profil" className={({ isActive }) => (isActive ? 'text-blue-600' : '')}>
                        <div className={iconeTransistion}>
                            <UserCircleIcon className={iconeSize} />
                            <p className="flex text-sm w-full">Profile</p>
                        </div>
                    </NavLink>
                </div>
                <button onClick={handleLogout}>
                    <div className={iconeTransistion}>
                        <ArrowLeftOnRectangleIcon className={iconeSize} />
                        <p className="hidden tablet:flex text-sm w-full">Logout</p>
                    </div>
                </button>
            </div>
        </nav>
    );
}
