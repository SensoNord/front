import { useEffect, useState } from 'react';
import WriteMessage from '../../components/Chat/Conversation/WriteMessage';
import Message from '../../components/Chat/Conversation/Message';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import { UserType } from '@directus/sdk';
import { MessageType } from '../../types/Chat/MessageType';
import { fetchConversationByIdAndPage } from '../../slicers/chat/conversation-slice';
import { PayloadFetchConversationByIdAndPage } from '../../slicers/chat/conversation-slice-helper';
import { directus } from '../../libraries/directus';

export default function Conversation() {
    const { currentConversationDisplayWithAllRelatedData } = useAppSelector(state => state.conversation);
    const { connectedUser } = useAppSelector(state => state.auth);
    const [otherUser, setOtherUser] = useState<UserType | null>(null);
    const [pageNb, setPageNb] = useState<number>(2);
    const dispatch = useAppDispatch();

    const [sortedMessages, setSortedMessages] = useState<MessageType[]>([]);
    const [totalNbMessages, setTotalNbMessages] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (currentConversationDisplayWithAllRelatedData?.messages_list) {
            const sortedMessages = [...currentConversationDisplayWithAllRelatedData!.messages_list].sort(
                (a: MessageType, b: MessageType) => {
                    return new Date(a.date_created).getTime() - new Date(b.date_created).getTime();
                },
            );
            setSortedMessages(sortedMessages);
        }
        // eslint-disable-next-line
    }, [currentConversationDisplayWithAllRelatedData?.messages_list]);

    useEffect(() => {
        if (currentConversationDisplayWithAllRelatedData?.id) {
            try {
                const fetchNbMessages = async () => {
                    let response = (await directus.items('messages').readByQuery({
                        filter: {
                            conversation_id: {
                                _eq: currentConversationDisplayWithAllRelatedData?.id,
                            },
                        },
                        aggregate: {
                            count: 'id',
                        },
                    })) as { data: [{ count: { id: number } }] };
                    setTotalNbMessages(response.data[0].count.id);
                };

                fetchNbMessages().then(() => setTimeout(() => setIsLoading(false), 1000));
            } catch (error) {
                console.error('Erreur lors de la récupération du nombre de messages:', error);
                throw error;
            }
        }
    }, [currentConversationDisplayWithAllRelatedData?.id]);

    useEffect(() => {
        if (currentConversationDisplayWithAllRelatedData) {
            const otherUserCandidate = currentConversationDisplayWithAllRelatedData.user_list.find(
                user => user.directus_users_id.id !== connectedUser?.id,
            );

            if (otherUserCandidate) {
                setOtherUser(otherUserCandidate.directus_users_id);
            }
        }
        // eslint-disable-next-line
    }, [currentConversationDisplayWithAllRelatedData?.user_list, connectedUser?.id]);

    const handleAddMessage = async () => {
        setIsLoading(true);
        await dispatch(
            fetchConversationByIdAndPage({
                conversationId: currentConversationDisplayWithAllRelatedData?.id,
                page: pageNb,
            } as PayloadFetchConversationByIdAndPage),
        );
        setPageNb(pageNb + 1);
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <>
            {currentConversationDisplayWithAllRelatedData && (
                <div style={{ height: '100%', position: 'relative' }} className={'overflow-hidden'}>
                    <div
                        className={'text-3xl justify-center flex border-b-2 border-gray-300 w-full px-10 pb-2 bg-white'}
                        style={{
                            position: 'absolute',
                            right: 0,
                            left: 0,
                        }}
                    >
                        <h1>
                            Conversation avec {otherUser?.first_name} {otherUser?.last_name}
                        </h1>
                    </div>
                    <div
                        style={{ backgroundColor: 'rgb(239, 246, 255)' }}
                        className={'grid grid-rows-[repeat(10,_minmax(0,_1fr))] grid-flow-col h-full mt-10'}
                    >
                        <div className={'row-[span_8_/_span_8] overflow-scroll overflow-x-hidden text-center'}>
                            {sortedMessages.length < totalNbMessages && (
                                <div className={'text-center'}>
                                    <button
                                        className={'mt-6 mb-4 bg-blue-300 p-2 rounded-xl'}
                                        onClick={handleAddMessage}
                                    >
                                        Afficher plus de messages
                                    </button>
                                </div>
                            )}
                            {!isLoading &&
                                sortedMessages.map((message: MessageType, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`flex ${
                                                message.user_created.id === connectedUser.id
                                                    ? 'justify-end'
                                                    : 'justify-start'
                                            }`}
                                        >
                                            <div className={'w-7/12'}>
                                                <Message
                                                    conversation={currentConversationDisplayWithAllRelatedData}
                                                    message={message}
                                                    align={
                                                        message.user_created.id === connectedUser?.id ? 'right' : 'end'
                                                    }
                                                    key={message.id}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                        <div className={'row-span-2 h-full border-t-2 border-gray-300'}>
                            <WriteMessage conversation={currentConversationDisplayWithAllRelatedData} pageNb={pageNb} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
