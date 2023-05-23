import { useState } from 'react';
import { useAppSelector } from '../../App/hooks';
import ChatNavbar from '../../components/Chat/ChatNavbar';
import { ChatEnum } from '../../types/Chat/ChatEnum';
import Subject from './Subject';
import Conversation from './Conversation';
import { Transition } from '@headlessui/react';
import ChatCreationMenu from '../../components/Chat/ChatCreationMenu';

export default function Chat() {
    const [selectedChat, setSelectedChat] = useState<ChatEnum>(ChatEnum.NONE);
    const { currentSubjectDisplayWithAllRelatedData } = useAppSelector(
        state => state.subject,
    );
    const { currentConversationDisplayWithAllRelatedData } = useAppSelector(
        state => state.conversation,
    );

    const [isSubjectAddButtonClick, setIsSubjectAddButtonClick] =
        useState<boolean>(false);
    const [isConversationAddButtonClick, setIsConversationAddButtonClick] =
        useState<boolean>(false);

    const handleSubjectButtonClick = () => {
        setSelectedChat(ChatEnum.NONE);
        setIsSubjectAddButtonClick(true);
        setIsConversationAddButtonClick(false);
    };

    const handleConversationButtonClick = () => {
        setSelectedChat(ChatEnum.NONE);
        setIsConversationAddButtonClick(true);
        setIsSubjectAddButtonClick(false);
    };

    const handleSetSelectedChat = (selectedChat: ChatEnum) => {
        setSelectedChat(selectedChat);
        setIsSubjectAddButtonClick(false);
        setIsConversationAddButtonClick(false);
    };

    return (
        <div
            style={{
                height: 'calc(100vh - 100px)',
            }}
            className="flex"
        >
            <div className="laptop:w-60">
                <ChatNavbar
                    selectedChat={selectedChat}
                    handleSetSelectedChat={handleSetSelectedChat}
                    handleSubjectButtonClick={handleSubjectButtonClick}
                    handleConversationButtonClick={
                        handleConversationButtonClick
                    }
                />
            </div>
            <div className="flex-1 bg-blue-50">
                {isConversationAddButtonClick || isSubjectAddButtonClick ? (
                    <div className="h-full flex items-center justify-center">
                        <ChatCreationMenu />
                    </div>
                ) : (
                    <>
                        {selectedChat === ChatEnum.SUBJECT &&
                            currentSubjectDisplayWithAllRelatedData && (
                                <Subject />
                            )}
                        {selectedChat === ChatEnum.CONVERSATION &&
                            currentConversationDisplayWithAllRelatedData && (
                                <Conversation />
                            )}
                    </>
                )}
            </div>
        </div>
    );
}
