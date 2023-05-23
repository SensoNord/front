import { ResponseType } from './ResponseType';
import { UserType } from '@directus/sdk';

export type PostType = {
    id: string;
    user_created: UserType;
    date_created: Date;
    user_updated: UserType;
    date_updated: Date;
    title: string;
    message: string;
    responses: ResponseType[];
    file_id: string;
    subject_id: string;
    sondage_id: number | null;
};

const emptyPost: PostType = {
    id: '',
    user_created: {} as UserType,
    date_created: new Date(),
    user_updated: {} as UserType,
    date_updated: new Date(),
    title: '',
    message: '',
    responses: [],
    file_id: '',
    subject_id: '',
    sondage_id: null,
};

export { emptyPost };
