import { emptyUser, UserType } from './UserType';
import { MessageResponseType } from './MessageResponseType';

export type PostType = {
    id: string;
    user_created: UserType;
    date_created: Date;
    user_updated: UserType;
    date_updated: Date;
    title: string;
    message: string;
    responses: MessageResponseType[];
    file_id: string;
    subject_id: string;
};

const emptyPost: PostType = {
    id: '',
    user_created: emptyUser,
    date_created: new Date(),
    user_updated: emptyUser,
    date_updated: new Date(),
    title: '',
    message: '',
    responses: [],
    file_id: '',
    subject_id: '',
};

export { emptyPost };
