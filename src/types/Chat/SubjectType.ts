import { UserType } from '@directus/sdk';
import { PostType } from './PostType';

export type SubjectType = {
    id: string;
    user_created: UserType;
    date_created: Date;
    user_updated: UserType;
    date_updated: Date;
    name: string;
    user_list: [
        {
            directus_users_id: UserType;
        },
    ];
    posts: PostType[] | [];
    folder_id: string;
};

const emptySubject: SubjectType = {
    id: '',
    user_created: {} as UserType,
    date_created: new Date(),
    user_updated: {} as UserType,
    date_updated: new Date(),
    name: '',
    user_list: [
        {
            directus_users_id: {} as UserType,
        },
    ],
    posts: [],
    folder_id: '',
};

export { emptySubject };
