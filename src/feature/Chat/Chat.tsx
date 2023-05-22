import { useState } from 'react';
import { useAppSelector } from '../../App/hooks';
import ChatNavbar from '../../components/Chat/ChatNavbar';
import { ChatEnum } from '../../types/Chat/ChatEnum';
import Subject from './Subject';
import Conversation from './Conversation';

export default function Chat() {
    const [selectedChat, setSelectedChat] = useState<ChatEnum>(ChatEnum.NONE);
    const { currentSubjectDisplayWithAllRelatedData } = useAppSelector(
        state => state.subject,
    );
    const { currentConversationDisplayWithAllRelatedData } = useAppSelector(
        state => state.conversation,
    );

    return (
        <div className="flex">
            <div className="laptop:w-60">
                <ChatNavbar
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                />
            </div>
            <div className="flex-1">
                {selectedChat === ChatEnum.SUBJECT &&
                    currentSubjectDisplayWithAllRelatedData && <Subject />}
                {selectedChat === ChatEnum.CONVERSATION &&
                    currentConversationDisplayWithAllRelatedData && (
                        <Conversation />
                    )}
            </div>
        </div>
    );
}
