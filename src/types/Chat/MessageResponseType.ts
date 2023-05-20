import { UserType } from '@directus/sdk';

export type MessageResponseType = {
    id: string;
    user_created: UserType;
    date_created: Date;
    user_updated: UserType;
    date_updated: Date;
    message: string;
    file_id: string;
    post_id: string;
};

const emptyMessageResponse: MessageResponseType = {
    id: '',
    user_created: {} as UserType,
    date_created: new Date(),
    user_updated: {} as UserType,
    date_updated: new Date(),
    message: '',
    file_id: '',
    post_id: '',
};

export { emptyMessageResponse };
