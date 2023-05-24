import { UserType } from '@directus/sdk';

export type MessageType = {
    id: string;
    user_created: UserType;
    date_created: Date;
    user_updated: UserType;
    date_updated: Date;
    message: string;
    file_id: string;
    conversation_id: string;
};
