import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import { fetchAllVisibleSubjectAndRelatedPost } from '../../slicers/subject-slice';
import SubjectItem from './Subject/SubjectItem';
import { fetchAllVisibleConversationAndRelatedMessage } from '../../slicers/conversation-slice';
import { ConversationType } from '../../types/Chat/ConversationType';
import ConversationItem from './Conversation/ConversationItem';
import { SubjectType } from '../../types/Chat/SubjectType';
import { ChatEnum } from '../../types/Chat/ChatEnum';

type ChatNavbarProps = {
    selectedChat: ChatEnum;
    setSelectedChat: (selectedChat: ChatEnum) => void;
};

export default function ChatNavbar(props: ChatNavbarProps) {
    const { selectedChat, setSelectedChat } = props;
    const dispatch = useAppDispatch();
    const { subjectListDisplay } = useAppSelector(state => state.subject);
    const { conversationListDisplay } = useAppSelector(
        sate => sate.conversation,
    );
    const [connectedUserId, setConnectedUserId] = useState<string>('');
    const [connectedUserRoleName, setConnectedUserRoleName] =
        useState<string>('');

    useEffect(() => {
        setConnectedUserId(localStorage.getItem('connectedUserId') as string);
        setConnectedUserRoleName(
            localStorage.getItem('connectedUserRoleName') as string,
        );
    }, [connectedUserId, connectedUserRoleName]);

    useEffect(() => {
        const fetchAllSubject = async () => {
            // TODO:
            // Pour l'instant on fetch tout les subjects et tout les posts
            // Probablement vouer à disparaitre, plutot faire d'abord un fetchAllSubject (sans les posts)
            // puis quand on click sur un subject, on fetchAllPostBySubjectId
            await dispatch(fetchAllVisibleSubjectAndRelatedPost());
        };

        const fetchAllConversation = async () => {
            await dispatch(fetchAllVisibleConversationAndRelatedMessage());
        };

        fetchAllSubject();
        fetchAllConversation();
    }, [dispatch]);

    return (
        <>
            <div className="flex flex-col">
                {subjectListDisplay.map((subject: SubjectType) => {
                    return (
                        <SubjectItem
                            subject={subject}
                            selectedChat={selectedChat}
                            setSelectedChat={setSelectedChat}
                            key={subject.id + 'chatNavbar'}
                        />
                    );
                })}
                {conversationListDisplay.map(
                    (conversation: ConversationType) => {
                        return (
                            <ConversationItem
                                conversation={conversation}
                                selectedChat={selectedChat}
                                setSelectedChat={setSelectedChat}
                                key={conversation.id + 'chatNavbar'}
                            />
                        );
                    },
                )}
            </div>
        </>
    );
}
