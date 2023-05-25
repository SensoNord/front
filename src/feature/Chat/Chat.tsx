import { useEffect, useState } from 'react';
import { useAppSelector } from '../../App/hooks';
import ChatNavbar from '../../components/Chat/ChatNavbar';
import { ChatEnum } from '../../types/Chat/ChatEnum';
import Subject from './Subject';
import Conversation from './Conversation';
import ChatCreationMenu from '../../components/Chat/Create/ChatCreationMenu';

const ID_FORUM = 'adca289e-8c53-4bb1-b4b5-ca6dd6f7b58a';
const ID_CONVERSATION = 'b402c651-a4e2-4eec-9686-f71e8b27321a';

export type ChatCreation = {
    name: 'forum' | 'conversation';
    id: string;
};

const conversationChat = {
    name: 'conversation',
    id: ID_CONVERSATION,
} as ChatCreation;

const forumChat = {
    name: 'forum',
    id: ID_FORUM,
} as ChatCreation;

export default function Chat() {
    const { currentSubjectDisplayWithAllRelatedData } = useAppSelector(state => state.subject);
    const { currentConversationDisplayWithAllRelatedData } = useAppSelector(state => state.conversation);
    const [selectedChat, setSelectedChat] = useState<ChatEnum>(ChatEnum.NONE);
    const [isSubjectAddButtonClick, setIsSubjectAddButtonClick] = useState<boolean>(false);
    const [isConversationAddButtonClick, setIsConversationAddButtonClick] = useState<boolean>(false);

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
                    handleConversationButtonClick={handleConversationButtonClick}
                />
            </div>
            <div className="flex-1 bg-blue-50">
                {isConversationAddButtonClick || isSubjectAddButtonClick ? (
                    <div className="h-full flex items-center justify-center">
                        <ChatCreationMenu
                            createdChat={isConversationAddButtonClick ? conversationChat : forumChat}
                            handleSetSelectedChat={handleSetSelectedChat}
                        />
                    </div>
                ) : (
                    <>
                        {selectedChat === ChatEnum.SUBJECT && currentSubjectDisplayWithAllRelatedData && <Subject />}
                        {selectedChat === ChatEnum.CONVERSATION && currentConversationDisplayWithAllRelatedData && (
                            <Conversation />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
