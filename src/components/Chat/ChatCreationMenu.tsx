import { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/solid';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import { fetchUserList } from '../../slicers/user/user-slice';
import stringSimilarity from 'string-similarity';
import { UserType } from '@directus/sdk';

type ChatCreationMenuProps = {};

export default function ChatCreationMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useAppDispatch();
    const { userList } = useAppSelector(state => state.user);
    const [matchedUserList, setMatchedUserList] = useState([] as UserType[]);
    const leveinshtenCoef = 0.8;

    const handleSearchChange = (e: any) => {
        let newSearchTerm = e.target.value;

        const matchUser = userList.filter((user: any) => {
            if (newSearchTerm.trim() === '') {
                return false;
            }

            let firstName = user.first_name || '';
            let lastName = user.last_name || '';

            let userFullName = (firstName + ' ' + lastName).toLowerCase();

            if (
                stringSimilarity.compareTwoStrings(
                    userFullName,
                    newSearchTerm.toLowerCase(),
                ) > leveinshtenCoef
            ) {
                return true;
            }

            if (
                stringSimilarity.compareTwoStrings(
                    firstName.toLowerCase(),
                    newSearchTerm.toLowerCase(),
                ) > leveinshtenCoef
            ) {
                return true;
            }

            if (
                stringSimilarity.compareTwoStrings(
                    lastName.toLowerCase(),
                    newSearchTerm.toLowerCase(),
                ) > leveinshtenCoef
            ) {
                return true;
            }

            return false;
        });
        setMatchedUserList(matchUser);
    };

    useEffect(() => {
        dispatch(fetchUserList());
    }, [dispatch]);

    return (
        <div className="flex justify-center items-center">
            <div className="py-4 px-4 bg-white rounded-3xl shadow-2xl text-center">
                <div className="flex justify-between items-center space-x-4">
                    <div className="flex items-center rounded-full bg-gray-200 px-3 py-2">
                        <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
                        <input
                            className="ml-2 bg-transparent focus:outline-none w-full text-lg"
                            placeholder="Rechercher"
                            onChange={handleSearchChange}
                        />
                    </div>
                    {isMenuOpen ? (
                        <XMarkIcon className="h-8 w-8 text-gray-400" />
                    ) : (
                        <Bars3Icon className="h-8 w-8 text-gray-400" />
                    )}
                </div>
                <div className="border-t-2 border-gray-300 my-4"></div>
                <div
                    className="pb-2"
                    style={{
                        minHeight: '200px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                    }}
                >
                    {matchedUserList.map((user: any) => (
                        <div
                            className="flex items-center space-x-4 py-2"
                            key={user.id}
                        >
                            <h1 className="text-lg">
                                {user.first_name} {user.last_name}
                            </h1>
                        </div>
                    ))}
                </div>{' '}
                <button
                    type="submit"
                    className="w-3/5 bg-blue-500 hover:bg-blue-600 text-white text-lg tablet:text-xl rounded-lg p-2 tablet:p-3 focus:outline-none"
                >
                    Créer le groupe
                </button>
            </div>
        </div>
    );
}
