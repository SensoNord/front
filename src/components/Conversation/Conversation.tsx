import {FC, useEffect, useRef, useState} from "react";
import WriteMessage from "./WriteMessage";
import {ConversationType} from "../../types/Chat/ConversationType";
import {UserType} from "../../types/Chat/UserType";
import {directus} from "../../libraries/directus";
import folder from "../../lib/folder";
import Message from "./Message";
import {MessageResponseType} from "../../types/Chat/MessageResponseType";

const Conversation: FC<{ conv: ConversationType }> = ({conv}) => {
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [otherUser, setOtherUser] = useState<UserType | null>(null);

    const messagesEndRef = useRef(null) as { current: any };

    useEffect(() => {
        if (conv) {
            folder.getfileById('2c176079-3aec-4559-95e7-729e4833a68d').then((file) => {
                console.log(file);
            });
            directus.users.me.read({
                fields: ['id', 'first_name', 'last_name']
            }).then((tmpUser) => {
                setCurrentUser(tmpUser as UserType);
                let otherUserId = tmpUser.id === conv.user_list['0'].directus_users_id.id ? conv.user_list['1'].directus_users_id.id : conv.user_list['0'].directus_users_id.id;
                directus.users.readOne(otherUserId, {
                    fields: ['id', 'first_name', 'last_name']
                }).then((tmpUser) => {
                    setOtherUser(tmpUser as unknown as UserType);
                });
            });
        } else {
            window.alert('Invalid conversation');
        }
    }, [conv]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [conv]);

    return (
        <>
            {
                conv && (
                    <div style={{height: '100%', position: 'relative'}} className={"overflow-hidden"}>
                        <div className={'text-3xl justify-center flex border-2 border-black mx-auto px-10 pb-2 bg-white border-t-0'} style={{position: "absolute", maxWidth: 'max-content', right: 0, left: 0}}>
                            <h1>Conversation avec {otherUser?.first_name} {otherUser?.last_name}</h1>
                        </div>
                        <div style={{backgroundColor: 'rgb(239, 246, 255)'}} className={"grid grid-rows-[repeat(10,_minmax(0,_1fr))] grid-flow-col h-full"}>
                            <div className={'row-[span_8_/_span_8] overflow-scroll overflow-x-hidden'} style={{overflowAnchor: 'auto'}}>
                                {
                                    conv.messages_list.sort((a: MessageResponseType, b: MessageResponseType) => {
                                        return new Date(a.date_created).getTime() - new Date(b.date_created).getTime();
                                    }).map((message: MessageResponseType) => {
                                        return (
                                            <div className={`flex ${message.user_created.id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                                                <div className={"w-7/12"}>
                                                    <Message message={message} currentUser={currentUser} align={message.user_created.id === currentUser?.id ? 'right' : 'end'}/>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                <div ref={messagesEndRef} />
                            </div>
                            <div className={"row-span-2 h-full"}>
                                <WriteMessage conv={conv}/>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
};

export default Conversation;