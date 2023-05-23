import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import { fetchUserList } from '../../../slicers/user/user-slice';
import stringSimilarity from 'string-similarity';
import { UserType } from '@directus/sdk';
import PersonItem from './PersonItem';

export default function ChatCreationMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useAppDispatch();
    const { userList } = useAppSelector(state => state.user);
    const [selectedUser, setSelectedUser] = useState([] as UserType[]);
    const [matchedUserList, setMatchedUserList] = useState([] as UserType[]);
    const leveinshtenCoef = 0.8;
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        console.log(selectedUser);
    }, [selectedUser]);

    const handleSelectUser = (user: UserType) => {
        setSelectedUser(selectedUser => [...selectedUser, user]);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleRemoveSelectedUser = (user: UserType) => {
        setSelectedUser(selectedUser => selectedUser.filter((selectedUser: UserType) => selectedUser.id !== user.id));
    };

    useEffect(() => {
        const matchedUserListWithoutSelectedUser = matchedUserList.filter((user: any) => {
            return !selectedUser.includes(user);
        });

        setMatchedUserList(matchedUserListWithoutSelectedUser);
    }, [selectedUser]);

    const handleSearchChange = (newSearchTerm: string) => {
        const userListWithoutSelectedUser = userList.filter((user: any) => {
            return !selectedUser.includes(user);
        });

        const matchUser = userListWithoutSelectedUser.filter((user: any) => {
            if (newSearchTerm.trim() === '') {
                return false;
            }

            const dbUserFirstName = user.first_name || '';
            const dbUserLastName = user.last_name || '';

            const inputFullName = newSearchTerm.split(' ');

            const firstNameSimilarityFirstWord = stringSimilarity.compareTwoStrings(
                dbUserFirstName.toLowerCase(),
                inputFullName[0].toLowerCase(),
            );
            const lastNameSimilarityFirstWord = stringSimilarity.compareTwoStrings(
                dbUserLastName.toLowerCase(),
                inputFullName[0].toLowerCase(),
            );

            const firstNameSimilaritySecondWord = inputFullName[1]
                ? stringSimilarity.compareTwoStrings(dbUserFirstName.toLowerCase(), inputFullName[1].toLowerCase())
                : 0;
            const lastNameSimilaritySecondWord = inputFullName[1]
                ? stringSimilarity.compareTwoStrings(dbUserLastName.toLowerCase(), inputFullName[1].toLowerCase())
                : 0;

            const firstWordSimilarity = Math.max(firstNameSimilarityFirstWord, lastNameSimilarityFirstWord);
            const secondWordSimilarity = Math.max(firstNameSimilaritySecondWord, lastNameSimilaritySecondWord);

            return firstWordSimilarity >= leveinshtenCoef || secondWordSimilarity >= leveinshtenCoef;
        });
        setMatchedUserList(matchUser);
    };

    useEffect(() => {
        dispatch(fetchUserList());
    }, [dispatch]);

    const handleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="flex justify-center items-start shadow-2xl rounded-3xl text-center bg-white py-4 px-4">
            <div className={`${isMenuOpen ? 'tablet:pr-4 tablet:border-r-2 tablet:border-gray-300' : ''}`}>
                <div className="flex items-center space-x-4">
                    {/* Menu tablet > */}
                    <div className="hidden tablet:block">
                        <div className="flex items-center rounded-full bg-gray-200 px-3 py-2">
                            <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
                            <input
                                className="ml-2 bg-transparent focus:outline-none w-full text-lg"
                                placeholder="Rechercher"
                                onChange={e => handleSearchChange(e.target.value)}
                                ref={inputRef}
                            />
                        </div>
                    </div>
                    {/* Menu tablet < */}
                    <div className="tablet:hidden">
                        <div className="flex items-center rounded-full bg-gray-200 px-3 py-2">
                            <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
                            <input
                                className={`ml-2 bg-transparent focus:outline-none w-full text-lg ${
                                    isMenuOpen ? 'cursor-not-allowed opacity-10' : ''
                                }`}
                                placeholder={isMenuOpen ? 'Participants' : 'Rechercher'}
                                onChange={e => handleSearchChange(e.target.value)}
                                disabled={isMenuOpen}
                            />
                        </div>
                    </div>
                    {isMenuOpen ? (
                        <XMarkIcon onClick={handleMenuOpen} className="h-8 w-8 text-gray-400 cursor-pointer" />
                    ) : (
                        <Bars3Icon onClick={handleMenuOpen} className="h-8 w-8 text-gray-400 cursor-pointer" />
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
                    {/* List of users found - Tablet > */}
                    <div className="hidden tablet:block">
                        {matchedUserList.map((user: any) => (
                            <div className="flex space-x-4" key={user.id}>
                                <PersonItem user={user} handleSelectUser={handleSelectUser} type="matched" />
                            </div>
                        ))}
                    </div>
                    {/* List of users found - Tablet < */}
                    <div className="tablet:hidden">
                        {!isMenuOpen &&
                            matchedUserList.map((user: any) => (
                                <div className="flex space-x-4" key={user.id}>
                                    <PersonItem user={user} handleSelectUser={handleSelectUser} type="matched" />
                                </div>
                            ))}
                    </div>
                    {/* List of users selected - Tablet < */}
                    <div className="tablet:hidden">
                        {isMenuOpen &&
                            selectedUser.map((user: UserType) => (
                                <div className="flex space-x-4" key={user.id}>
                                    <PersonItem
                                        user={user}
                                        handleSelectUser={handleRemoveSelectedUser}
                                        type="selected"
                                    />
                                </div>
                            ))}
                    </div>
                </div>{' '}
                <button
                    type="submit"
                    className="w-2/3 bg-blue-500 hover:bg-blue-600 text-white text-lg tablet:text-xl rounded-lg p-2 tablet:p-3 focus:outline-none"
                >
                    Créer le groupe {selectedUser.length > 0 && `(${selectedUser.length})`}
                </button>
            </div>
            {/* List of users selected - Tablet > */}
            {isMenuOpen && (
                <div className="hidden tablet:block w-64 pl-4">
                    <h1 className="flex text-lg h-11 items-center justify-center">Participants</h1>
                    <div className="border-t-2 border-gray-300 my-4"></div>
                    <div
                        className="pb-4"
                        style={{
                            minHeight: '200px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                        }}
                    >
                        {selectedUser.map((user: UserType) => (
                            <div className="flex space-x-4" key={user.id}>
                                <PersonItem user={user} handleSelectUser={handleRemoveSelectedUser} type="selected" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
