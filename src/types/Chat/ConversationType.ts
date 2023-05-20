import {MessageResponseType} from "./MessageResponseType";
import { UserType } from "@directus/sdk";

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
