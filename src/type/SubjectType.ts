import {emptyUser, UserType} from "./UserType";
import {PostType} from "./PostType";

export type SubjectType = {
    user_created: UserType;
    date_created: Date;
    user_updated: UserType;
    date_updated: Date;
    name: string;
    user_list: [
        {
            directus_users_id: UserType;
        }
    ];
    posts: PostType[] | [];
}

const emptySubject: SubjectType = {
        user_created: emptyUser,
        date_created: new Date(),
        user_updated: emptyUser,
        date_updated: new Date(),
        name: "",
        user_list: [
            {
                directus_users_id: emptyUser
            }
        ],
        posts: []
};

export {emptySubject};
