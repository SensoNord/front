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
    const [connectedUserId, setConnectedUserId] = useState<string>('');
    const { currentConversationDisplayWithAllRelatedData } = useAppSelector(
        state => state.conversation,
    );

    useEffect(() => {
        setConnectedUserId(localStorage.getItem('connectedUserId') as string);

        setDisplayableConversationName(
            conversation.user_list[0].directus_users_id.id === connectedUserId
                ? conversation.user_list[1].directus_users_id.first_name
                : conversation.user_list[0].directus_users_id.first_name,
        );
    }, [conversation, connectedUserId]);

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
