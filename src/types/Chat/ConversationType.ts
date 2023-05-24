import { UserType } from '@directus/sdk';
import { MessageType } from './MessageType';

export type ConversationType = {
    id: string;
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
        },
    ];
    messages_list: MessageType[] | [];
    folder_id: string;
};
