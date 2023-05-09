import {directus} from "../services/directus";
import {SubjectType} from "../type/SubjectType";


export default class Forum {
    static async connection() {
        return directus.auth.login({email: "first.user@example.com", password: "password"});
        // return directus.auth.login({email: "sensonord.dev@gmail.com", password: "c9wiHGaB!1ZhQo!U"});
    }

    static async getSubjects(subject_id: string): Promise<SubjectType | null | undefined> {
        return (await directus.items('subjects').readOne(subject_id, {
            fields: [
                "id",
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
                "posts.user_created.id",
                "posts.date_created",
                "posts.user_updated.first_name",
                "posts.user_updated.last_name",
                "posts.date_updated",
                "posts.title",
                "posts.message",
                "posts.file_id",
                "posts.responses.user_created.first_name",
                "posts.responses.user_created.last_name",
                "posts.responses.user_created.id",
                "posts.responses.date_created",
                "posts.responses.user_updated.first_name",
                "posts.responses.user_updated.last_name",
                "posts.responses.date_updated",
                "posts.responses.message",
                "posts.responses.file_id",
                "folder_id"
            ]
        }));
    }

    static async createResponse(post_id: string, message: string, file_id: string | null = null): Promise<any> {
        return (await directus.items('responses').createOne({post_id: post_id, message: message, file_id: file_id}));
    }

    static async createPost(subject_id: string, title: string, message: string, file_id: string | null = null): Promise<any> {
        return (await directus.items('posts').createOne(
            {subject_id: subject_id, title: title, message: message, file_id: file_id}
        ));
    }

    static async deletePost(id: string) {
        await directus.items('posts').deleteOne(id);
    }

    static async updatePost(id: string, message: string) {
        return (await directus.items('posts').updateOne(id, {message: message}));
    }

    static async updateResponse(id: string, message: string) {
        return (await directus.items('responses').updateOne(id, {message: message}));
    }
}
