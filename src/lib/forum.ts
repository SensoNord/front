import {directus} from "../services/directus";
import {SubjectType} from "../type/SubjectType";


export default class Forum {
    static async getSubjects(subject_id: string): Promise<SubjectType | null | undefined> {
        return (await directus.items('subjects').readOne(subject_id, {
            fields: [
                "user_created.first_name",
                "user_created.last_name",
                "date_created",
                "user_updated.first_name",
                "user_updated.last_name",
                "date_updated",
                "name",
                "user_list.directus_users_id.first_name",
                "user_list.directus_users_id.last_name",
                "posts.id",
                "posts.user_created.first_name",
                "posts.user_created.last_name",
                "posts.date_created",
                "posts.user_updated.first_name",
                "posts.user_updated.last_name",
                "posts.date_updated",
                "posts.title",
                "posts.message",
                "posts.responses.user_created.first_name",
                "posts.responses.user_created.last_name",
                "posts.responses.date_created",
                "posts.responses.user_updated.first_name",
                "posts.responses.user_updated.last_name",
                "posts.responses.date_updated",
                "posts.responses.message",
            ]
        }));
    }

    static async createResponse(post_id: string, message: string): Promise<any> {
        return (await directus.items('responses').createOne({post_id, message}
        ));
    }

    static async createPost(subject_id: string, title: string, message: string): Promise<any> {
        return (await directus.items('posts').createOne(
            {subject_id: subject_id, title: title, message: message}
        ));
    }
}
