import { useEffect, useState } from 'react';
import { ConversationType } from '../../../types/Chat/ConversationType';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import { ChatEnum } from '../../../types/Chat/ChatEnum';
import { setCurrentConversationDisplay } from '../../../slicers/conversation-slice';

type ConversationItemProps = {
    conversation: ConversationType;
    selectedChat: ChatEnum;
    setSelectedChat: (selectedChat: ChatEnum) => void;
};

export default function ConversationItem(props: ConversationItemProps) {
    const { conversation, selectedChat, setSelectedChat } = props;
    const dispatch = useAppDispatch();
    const [isCurrentConversation, setIsCurrentConversation] =
        useState<boolean>(false);
    const [displayableConversationName, setDisplayableConversationName] =
        useState<string>('');
    const { currentConversationDisplayWithAllRelatedData } = useAppSelector(
        state => state.conversation,
    );
    const { connectedUser } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (conversation) {
            const otherUserCandidate = conversation.user_list.find(
                user => user.directus_users_id.id !== connectedUser?.id
            );
    
            if (otherUserCandidate) {
                setDisplayableConversationName(otherUserCandidate.directus_users_id.first_name + ' ' + otherUserCandidate.directus_users_id.last_name);
            }
        }
    }, [conversation]);    

    useEffect(() => {
        if (
            currentConversationDisplayWithAllRelatedData &&
            currentConversationDisplayWithAllRelatedData.id ===
                conversation.id &&
            selectedChat === ChatEnum.CONVERSATION
        ) {
            setIsCurrentConversation(true);
        } else {
            setIsCurrentConversation(false);
        }
    }, [
        currentConversationDisplayWithAllRelatedData,
        conversation,
        selectedChat,
    ]);

    const handleChangeSelectedConversation = (
        conversation: ConversationType,
    ) => {
        setSelectedChat(ChatEnum.CONVERSATION);
        dispatch(setCurrentConversationDisplay(conversation));
    };

    return (
        <div
            key={conversation.id + 'item'}
            onClick={() => handleChangeSelectedConversation(conversation)}
            className={`${
                isCurrentConversation ? 'bg-blue-200' : ''
            } cursor-pointer`}
        >
            <h1>{displayableConversationName}</h1>
        </div>
    );
}
