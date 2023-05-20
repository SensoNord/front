import { useEffect, useRef, useState } from 'react';
import WriteMessage from '../../components/Chat/Conversation/WriteMessage';
import Message from '../../components/Chat/Conversation/Message';
import { MessageResponseType } from '../../types/Chat/MessageResponseType';
import { useAppSelector } from '../../App/hooks';
import { UserType } from '@directus/sdk';

export default function Conversation() {
    const { currentConversationDisplayWithAllRelatedData } = useAppSelector(
        state => state.conversation,
    );
    const { connectedUser } = useAppSelector(state => state.auth);
    const [otherUser, setOtherUser] = useState<UserType | null>(null);

    const [sortedMessages, setSortedMessages] = useState<MessageResponseType[]>(
        [],
    );

    const messagesEndRef = useRef(null) as { current: any };

    useEffect(() => {
        const sortedMessages = [
            ...currentConversationDisplayWithAllRelatedData!.messages_list,
        ].sort((a: MessageResponseType, b: MessageResponseType) => {
            return (
                new Date(b.date_created).getTime() -
                new Date(a.date_created).getTime()
            );
        });
        setSortedMessages(sortedMessages);
    }, [currentConversationDisplayWithAllRelatedData]);

    useEffect(() => {
        if (currentConversationDisplayWithAllRelatedData) {
            const otherUserCandidate = currentConversationDisplayWithAllRelatedData.user_list.find(
                user => user.directus_users_id.id !== connectedUser?.id
            );
    
            if (otherUserCandidate) {
                setOtherUser(otherUserCandidate.directus_users_id);
            }
        }
    }, [currentConversationDisplayWithAllRelatedData]);    

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentConversationDisplayWithAllRelatedData]);

    return (
        <>
            {currentConversationDisplayWithAllRelatedData && (
                <div style={{ height: '100%' }} className={'overflow-hidden'}>
                    <div
                        className={
                            'text-3xl justify-center flex border-2 border-black mx-auto px-10 pb-2 bg-white border-t-0'
                        }
                        style={{
                            position: 'absolute',
                            maxWidth: 'max-content',
                            right: 0,
                            left: 0,
                        }}
                    >
                        <h1>
                            Conversation avec {otherUser?.first_name}{' '}
                            {otherUser?.last_name}
                        </h1>
                    </div>
                    <div
                        style={{ backgroundColor: 'rgb(239, 246, 255)' }}
                        className={
                            'grid grid-rows-[repeat(10,_minmax(0,_1fr))] grid-flow-col h-full'
                        }
                    >
                        <div
                            className={
                                'row-[span_8_/_span_8] overflow-scroll overflow-x-hidden'
                            }
                            style={{ overflowAnchor: 'auto' }}
                        >
                            {sortedMessages.map(
                                (message: MessageResponseType) => {
                                    return (
                                        <div
                                            className={`flex ${message.user_created.id ===
                                                connectedUser.id
                                                    ? 'justify-end'
                                                    : 'justify-start'
                                                }`}
                                        >
                                            <div className={'w-7/12'}>
                                                <Message
                                                    message={message}
                                                    currentUser={connectedUser}
                                                    align={
                                                        message.user_created
                                                            .id ===
                                                            connectedUser?.id
                                                            ? 'right'
                                                            : 'end'
                                                    }
                                                />
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className={'row-span-2 h-full'}>
                            <WriteMessage
                                conv={
                                    currentConversationDisplayWithAllRelatedData
                                }
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
