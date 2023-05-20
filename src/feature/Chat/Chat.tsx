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
        <>
            <div className="flex">
                <div className="w-1/4">
                    <ChatNavbar
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                    />
                </div>
                {selectedChat === ChatEnum.SUBJECT &&
                    currentSubjectDisplayWithAllRelatedData && (
                        <div className="w-3/4">
                            <Subject />
                        </div>
                    )}
                {selectedChat === ChatEnum.CONVERSATION &&
                    currentConversationDisplayWithAllRelatedData && (
                        <div className="w-3/4">
                            <Conversation />
                        </div>
                    )}
            </div>
        </>
    );
}
