import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import {fetchAllVisibleSubject} from '../../slicers/chat/subject-slice';
import SubjectItem from './Subject/SubjectItem';
import {fetchAllVisibleConversation} from '../../slicers/chat/conversation-slice';
import { ConversationType } from '../../types/Chat/ConversationType';
import ConversationItem from './Conversation/ConversationItem';
import { SubjectType } from '../../types/Chat/SubjectType';
import { ChatEnum } from '../../types/Chat/ChatEnum';
import { PlusCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid } from '@heroicons/react/24/solid';
import { Fragment } from 'react';
import { Transition } from '@headlessui/react';

type ChatNavbarProps = {
    selectedChat: ChatEnum;
    handleSetSelectedChat: (selectedChat: ChatEnum) => void;
    handleSubjectButtonClick: () => void;
    handleConversationButtonClick: () => void;
};

export default function ChatNavbar(props: ChatNavbarProps) {
    const { selectedChat, handleSetSelectedChat, handleSubjectButtonClick, handleConversationButtonClick } = props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const dispatch = useAppDispatch();
    const { subjectListDisplay } = useAppSelector(state => state.subject);
    const { conversationListDisplay } = useAppSelector(sate => sate.conversation);
    const [connectedUserId, setConnectedUserId] = useState<string>('');
    const [connectedUserRoleName, setConnectedUserRoleName] = useState<string>('');

    useEffect(() => {
        setConnectedUserId(localStorage.getItem('connectedUserId') as string);
        setConnectedUserRoleName(localStorage.getItem('connectedUserRoleName') as string);
    }, [connectedUserId, connectedUserRoleName]);

    useEffect(() => {
        const localFetchAllSubject = async () => {
            await dispatch(fetchAllVisibleSubject());
        };

        const localFetchAllConversation = async () => {
            await dispatch(fetchAllVisibleConversation());
        };

        localFetchAllSubject();
        localFetchAllConversation();
    }, [dispatch]);

    const className = 'my-1 mx-4 px-2 py-1 cursor-pointer hover:bg-blue-100 rounded-lg';

    return (
        <>
            <div className="laptop:hidden fixed left-0 z-30 p-2">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-400"
                >
                    {isMenuOpen ? (
                        <ChatBubbleLeftRightIconSolid className="h-6 w-6" />
                    ) : (
                        <ChatBubbleLeftRightIcon className="h-6 w-6" />
                    )}
                </button>
            </div>
            <Transition
                as={Fragment}
                show={isMenuOpen}
                enter="transition ease-out duration-200 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in duration-200 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
            >
                <nav className="laptop:hidden border-r-2 border-gray-300 pl-12 fixed left-0 h-full bg-white overflow-auto transition-transform duration-200 transform laptop:relative laptop:translate-x-0 laptop:w-auto laptop:h-auto laptop:overflow-visible z-20">
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mx-2 my-2">
                            <h1 className="text-2xl font-bold cursor-default pr-4">Groupes</h1>
                            <PlusCircleIcon
                                className="h-8 w-8 cursor-pointer hover:text-gray-500"
                                onClick={() => {
                                    handleSubjectButtonClick();
                                    setIsMenuOpen(!isMenuOpen);
                                }}
                            />
                        </div>
                        {subjectListDisplay.map((subject: SubjectType, index) => (
                            <div onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <SubjectItem
                                    subject={subject}
                                    selectedChat={selectedChat}
                                    handleSetSelectedChat={handleSetSelectedChat}
                                    key={index + '_chatNavbar'}
                                    className={className}
                                />
                            </div>
                        ))}
                        <div className="flex justify-between items-center mx-2 my-2">
                            <h1 className="text-2xl font-bold cursor-default pr-4">Conversations</h1>
                            <PlusCircleIcon
                                className="h-8 w-8 cursor-pointer hover:text-gray-500"
                                onClick={() => {
                                    handleConversationButtonClick();
                                    setIsMenuOpen(!isMenuOpen);
                                }}
                            />
                        </div>
                        {conversationListDisplay.map((conversation: ConversationType) => (
                            <div onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <ConversationItem
                                    conversation={conversation}
                                    selectedChat={selectedChat}
                                    handleSetSelectedChat={handleSetSelectedChat}
                                    key={conversation.id + 'chatNavbar'}
                                    className={className}
                                />
                            </div>
                        ))}
                    </div>
                </nav>
            </Transition>
            <nav className="hidden laptop:block laptop:fixed h-full border-r-2 border-gray-300 laptop:w-60">
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mx-2 my-2">
                        <h1 className="text-2xl font-bold cursor-default pr-4">Groupes</h1>
                        <PlusCircleIcon
                            className="h-8 w-8 cursor-pointer hover:text-gray-500"
                            onClick={handleSubjectButtonClick}
                        />
                    </div>
                    {subjectListDisplay.map((subject: SubjectType) => (
                        <SubjectItem
                            subject={subject}
                            selectedChat={selectedChat}
                            handleSetSelectedChat={handleSetSelectedChat}
                            key={subject.id + 'chatNavbar'}
                            className={className}
                        />
                    ))}
                    <div className="flex justify-between items-center mx-2 my-2">
                        <h1 className="text-2xl font-bold cursor-default pr-4">Conversations</h1>
                        <PlusCircleIcon
                            className="h-8 w-8 cursor-pointer hover:text-gray-500"
                            onClick={handleConversationButtonClick}
                        />
                    </div>
                    {conversationListDisplay.map((conversation: ConversationType) => (
                        <ConversationItem
                            conversation={conversation}
                            selectedChat={selectedChat}
                            handleSetSelectedChat={handleSetSelectedChat}
                            key={conversation.id + 'chatNavbar'}
                            className={className}
                        />
                    ))}
                </div>
            </nav>
        </>
    );
}
