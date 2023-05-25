import { useEffect, useState } from 'react';
import { ConversationType } from '../../../types/Chat/ConversationType';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import { ChatEnum } from '../../../types/Chat/ChatEnum';
import { fetchConversationByIdAndPage } from '../../../slicers/chat/conversation-slice';
import { PayloadFetchConversationByIdAndPage } from '../../../slicers/chat/conversation-slice-helper';

type ConversationItemProps = {
    conversation: ConversationType;
    selectedChat: ChatEnum;
    handleSetSelectedChat: (selectedChat: ChatEnum) => void;
    className: string;
};

export default function ConversationItem(props: ConversationItemProps) {
    const { conversation, selectedChat, handleSetSelectedChat, className } = props;
    const dispatch = useAppDispatch();
    const [isCurrentConversation, setIsCurrentConversation] = useState<boolean>(false);
    const [displayableConversationName, setDisplayableConversationName] = useState<string>('');
    const { currentConversationDisplayWithAllRelatedData } = useAppSelector(state => state.conversation);
    const { connectedUser } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (conversation) {
            const otherUserCandidate = conversation.user_list.find(
                user => user.directus_users_id.id !== connectedUser?.id,
            );
            if (otherUserCandidate) {
                setDisplayableConversationName(
                    otherUserCandidate.directus_users_id.first_name +
                        ' ' +
                        otherUserCandidate.directus_users_id.last_name,
                );
            }
        }
        // eslint-disable-next-line
    }, [conversation.user_list, connectedUser?.id]);

    useEffect(() => {
        if (
            currentConversationDisplayWithAllRelatedData &&
            currentConversationDisplayWithAllRelatedData.id === conversation.id &&
            selectedChat === ChatEnum.CONVERSATION
        ) {
            setIsCurrentConversation(true);
        } else {
            setIsCurrentConversation(false);
        }
    }, [currentConversationDisplayWithAllRelatedData, conversation, selectedChat]);

    const handleChangeSelectedConversation = async (conversation: ConversationType) => {
        handleSetSelectedChat(ChatEnum.CONVERSATION);
        await dispatch(
            fetchConversationByIdAndPage({
                conversationId: conversation.id,
                page: 1,
            } as PayloadFetchConversationByIdAndPage),
        );
    };

    return (
        <div
            key={conversation.id + 'item'}
            onClick={() => handleChangeSelectedConversation(conversation)}
            className={`${isCurrentConversation ? 'bg-blue-200' : ''} cursor-pointer ${className}`}
        >
            <h1>{displayableConversationName}</h1>
        </div>
    );
}
