import { UserType, emptyUser } from './UserType';

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
    user_created: emptyUser,
    date_created: new Date(),
    user_updated: emptyUser,
    date_updated: new Date(),
    message: '',
    file_id: '',
    post_id: '',
};

export { emptyMessageResponse };
