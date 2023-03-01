import {ItemInput, FileItem} from "@directus/sdk";
import {directus} from "../services/directus";
import {SubjectType} from "../type/SubjectType";
import {DirectusFileType} from "../type/DirectusFileType";


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
                "posts.date_created",
                "posts.user_updated.first_name",
                "posts.user_updated.last_name",
                "posts.date_updated",
                "posts.title",
                "posts.message",
                "posts.file_id",
                "posts.responses.user_created.first_name",
                "posts.responses.user_created.last_name",
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

    static async getFile(file_id: string): Promise<any> {
        return (await directus.files.readOne(file_id, {
            fields: [
                "type",
                "filename_download",
            ]
        }))
    }

    static async getFilesList(file_id: string): Promise<any> {
        return (await directus.files.readByQuery({
            filter: {
                "id": {
                    "_eq": file_id
                }
            },
            fields: [
                "id",
            ]
        }))
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

    static async uploadFile(form: FormData | ItemInput<FileItem<unknown>>, subject_id: string, folder_id: string, messageId: string, linkType: string): Promise<DirectusFileType | string | null | undefined> {
        let responseCreateFile = (await directus.files.createOne(form));
        if (responseCreateFile) {
            switch (linkType) {
                case 'Response':
                    console.log("response", responseCreateFile.id);
                    await directus.items('responses').updateOne(messageId, {
                        "file_id": responseCreateFile.id
                    })
                    break;
                case 'Post':
                    console.log('post', responseCreateFile.id, messageId)
                    await directus.items('posts').updateOne(messageId, {
                        "file_id": responseCreateFile.id
                    })
                    break;
            }
            let responseUpdateFile = await directus.files.updateOne(responseCreateFile.id, {
                "subject": [
                    {
                        "subjects_id": subject_id
                    }
                ],
                "folder": folder_id
            });
            return responseUpdateFile as unknown as DirectusFileType;
        }
        return 'No file updated';
    }

    static async test(): Promise<any> {
        return (await directus.relations);
    }
}
