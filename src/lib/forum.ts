import {directus} from "../services/directus";
import {SubjectType} from "../type/SubjectType";
import {ModifiedFileType} from "../type/ModifiedFileType";
import folder from "./folder";


export default class Forum {
    static async connection() {
        return directus.auth.login({email: process.env.REACT_APP_EMAIL_FIRST as string, password: process.env.REACT_APP_PASSWORD as string});
        // return directus.auth.login({email: process.env.REACT_APP_EMAIL_SECOND as string, password: process.env.REACT_APP_PASSWORD as string});
        // return directus.auth.login({email: process.env.REACT_APP_EMAIL_ADMIN as string, password: process.env.REACT_APP_PASSWORD_ADMIN as string});
    }

    static async getSubjects(subject_id: string): Promise<SubjectType | null | undefined> {
        return (await directus.items('subjects').readOne(subject_id, {
            fields: [
                "*",
                "user_created.*",
                "user_updated.*",
                "date_updated",
                "user_list.directus_users_id.*",
                "posts.*",
                "posts.user_created.*",
                "posts.user_updated.*",
                "posts.responses.*",
                "posts.responses.user_created.*",
                "posts.responses.user_updated.*",
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

    static async uploadFile(file: File | null, folder_id: string, subject_id: string): Promise<ModifiedFileType | null> {
        if (!file) return null;
        return await folder.uploadFile(file, folder_id, subject_id);
    }

    static async deleteResponse(id: string) {
        await directus.items('responses').deleteOne(id);
    }
}
