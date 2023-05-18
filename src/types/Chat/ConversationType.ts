import {emptyUser, UserType} from "./UserType";
import {MessageResponseType} from "./MessageResponseType";

export type ConversationType = {
    id: string
    user_created: UserType;
    date_created: Date;
    user_updated: UserType;
    date_updated: Date;
    user_list: [
        {
            directus_users_id: UserType;
        },
        {
            directus_users_id: UserType;
        }
    ];
    messages_list: MessageResponseType[] | [];
    folder_id: string
}

const emptyConversation: ConversationType = {
    id: "",
    user_created: emptyUser,
    date_created: new Date(),
    user_updated: emptyUser,
    date_updated: new Date(),
    user_list: [
        {
            directus_users_id: emptyUser
        },
        {
            directus_users_id: emptyUser
        }
    ],
    messages_list: [],
    folder_id: ""
};

export {emptyConversation};
