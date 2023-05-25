import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import { fetchUserListWithoutCurrentUser } from '../../../slicers/user/user-slice';
import stringSimilarity from 'string-similarity';
import { FolderType, UserType } from '@directus/sdk';
import PersonItem from './PersonItem';
import { ChatCreation } from '../../../feature/Chat/Chat';
import { PayloadCreateFolder, createFolder } from '../../../slicers/file/folder-slice';
import { createSubjectWithUser, setCurrentSubjectDisplayWithAllRelatedData } from '../../../slicers/chat/subject-slice';
import { DirectusUserType, PayLoadCreateSubject } from '../../../slicers/chat/subject-slice-helper';
import { ChatEnum } from '../../../types/Chat/ChatEnum';
import { SubjectType } from '../../../types/Chat/SubjectType';
import { v4 as uuidv4 } from 'uuid';
import {
    createConversation,
    setCurrentConversationDisplayWithAllRelatedData,
} from '../../../slicers/chat/conversation-slice';
import { PayLoadCreateMessage } from '../../../slicers/chat/conversation-slice-helper';
import { ConversationType } from '../../../types/Chat/ConversationType';

type ChatCreationMenuProps = {
    createdChat: ChatCreation;
    handleSetSelectedChat: (selectedChat: ChatEnum) => void;
};

export default function ChatCreationMenu(props: ChatCreationMenuProps) {
    const { createdChat, handleSetSelectedChat } = props;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useAppDispatch();
    const { userList } = useAppSelector(state => state.user);
    const { connectedUser } = useAppSelector(state => state.auth);

    const [chatName, setChatName] = useState('');
    const [selectedUser, setSelectedUser] = useState([] as UserType[]);
    const [matchedUserList, setMatchedUserList] = useState([] as UserType[]);
    const leveinshtenCoef = 0.8;
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSelectUser = (user: UserType) => {
        if (createdChat.name === 'forum') {
            setSelectedUser(selectedUser => [...selectedUser, user]);
        } else if (createdChat.name === 'conversation') {
            setSelectedUser(selectedUser => [user]);
        }
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
        // eslint-disable-next-line
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
        dispatch(fetchUserListWithoutCurrentUser());
        if (createdChat.name === 'conversation') {
            setChatName('Accept');
        }
        // eslint-disable-next-line
    }, [dispatch, connectedUser]);

    const handleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    function formatName(firstName: string, lastName: string): string {
        return `${firstName.charAt(0).toUpperCase()}.${lastName.charAt(0).toUpperCase()}${lastName.slice(1)}`;
    }

    const handleCreateGroup = async () => {
        let newChatName = chatName;

        if (createdChat.name === 'conversation') {
            if (
                connectedUser.first_name &&
                connectedUser.last_name &&
                selectedUser &&
                selectedUser[0].first_name &&
                selectedUser[0].last_name
            ) {
                newChatName =
                    formatName(connectedUser.first_name, connectedUser.last_name) +
                    '_' +
                    formatName(selectedUser[0].first_name, selectedUser[0].last_name);
                setChatName(newChatName);
            } else {
                newChatName = uuidv4();
                setChatName(newChatName);
            }
        }

        const createdFolderPayload = await dispatch(
            createFolder({
                name: newChatName,
                parentId: createdChat.id,
            } as PayloadCreateFolder),
        );

        const createdFolder = createdFolderPayload.payload as FolderType;

        const directusUserIdList = [] as DirectusUserType[];
        const directusConnectedUser = {
            directus_users_id: {
                id: connectedUser.id,
            },
        } as DirectusUserType;

        selectedUser.forEach(user => {
            directusUserIdList.push({
                directus_users_id: {
                    id: user.id,
                },
            } as DirectusUserType);
        });

        if (createdChat.name === 'forum') {
            const createdSubjectPayload = await dispatch(
                createSubjectWithUser({
                    name: chatName,
                    folderId: createdFolder.id,
                    userList: [...directusUserIdList, directusConnectedUser],
                } as PayLoadCreateSubject),
            );

            const subject = createdSubjectPayload.payload as SubjectType;

            dispatch(setCurrentSubjectDisplayWithAllRelatedData(subject.id));
            handleSetSelectedChat(ChatEnum.SUBJECT);
        } else if ((createdChat.name = 'conversation')) {
            const createConversationPayload = await dispatch(
                createConversation({
                    folderId: createdFolder.id,
                    userList: [...directusUserIdList, directusConnectedUser],
                } as PayLoadCreateMessage),
            );

            const conversation = createConversationPayload.payload as ConversationType;

            dispatch(setCurrentConversationDisplayWithAllRelatedData(conversation));
            handleSetSelectedChat(ChatEnum.CONVERSATION);
        }
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
                    {createdChat.name === 'forum' && (
                        <>
                            {isMenuOpen ? (
                                <XMarkIcon onClick={handleMenuOpen} className="h-8 w-8 text-gray-400 cursor-pointer" />
                            ) : (
                                <Bars3Icon onClick={handleMenuOpen} className="h-8 w-8 text-gray-400 cursor-pointer" />
                            )}
                        </>
                    )}
                </div>
                <div className="border-t-2 border-gray-300 my-4"></div>
                {createdChat.name === 'forum' && (
                    <>
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
                                            <PersonItem
                                                user={user}
                                                handleSelectUser={handleSelectUser}
                                                type="matched"
                                            />
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
                    </>
                )}

                {createdChat.name === 'conversation' && (
                    <>
                        <div
                            className="pb-2"
                            style={{
                                minHeight: '200px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                            }}
                        >
                            {matchedUserList.length >= 1 && <h1>Recherche</h1>}
                            {matchedUserList.map((user: any) => (
                                <div className="flex space-x-4" key={user.id}>
                                    <PersonItem user={user} handleSelectUser={handleSelectUser} type="matched" />
                                </div>
                            ))}
                            {selectedUser.length >= 1 && <h1>Sélection</h1>}
                            {selectedUser.map((user: UserType) => (
                                <div className="flex space-x-4" key={user.id}>
                                    <PersonItem
                                        user={user}
                                        handleSelectUser={handleRemoveSelectedUser}
                                        type="selected"
                                    />
                                </div>
                            ))}
                        </div>{' '}
                    </>
                )}

                {createdChat.name === 'forum' && (
                    <div>
                        <input
                            className="bg-gray-200 rounded-lg px-2 py-1 w-4/5 text-lg focus:outline-none my-4"
                            placeholder="Nom du groupe"
                            onChange={e => setChatName(e.target.value)}
                        />
                    </div>
                )}
                <button
                    type="submit"
                    disabled={chatName.length === 0 || selectedUser.length === 0}
                    className={`w-2/3 bg-blue-500 hover:bg-blue-600 text-white text-lg tablet:text-xl rounded-lg p-2 tablet:p-3 focus:outline-none
                    ${chatName.length === 0 || selectedUser.length === 0 ? 'cursor-not-allowed opacity-50' : ''}
                    `}
                    onClick={handleCreateGroup}
                >
                    {createdChat.name === 'forum' ? 'Créer le groupe' : 'Créer la conversation'}
                    {selectedUser.length > 0 && createdChat.name === 'forum' && ` (${selectedUser.length + 1})`}
                </button>
            </div>
            {/* List of users selected - Tablet > */}
            {isMenuOpen && createdChat.name === 'forum' && (
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
