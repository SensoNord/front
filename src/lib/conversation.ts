import {directus} from "../libraries/directus";
import {ConversationType} from "../types/Chat/ConversationType";

export default class conversation {
    static async getConversation(conversation_id: string): Promise<ConversationType | null | undefined> {
        return (await directus.items('conversations').readOne(conversation_id, {
            fields: [
                "*",
                "user_created.*",
                "user_updated.*",
                "date_updated",
                "user_list.directus_users_id.*",
                "messages_list.*",
                "messages_list.user_created.*",
                "messages_list.user_updated.*",
            ]
        }));
    }

    static async createMessage(conversation_id: string, message: string, file_id: string | null = null): Promise<any> {
        return (await directus.items('messages').createOne({conversation_id: conversation_id, message: message, file_id: file_id}));
    }

    static async deleteMessage(id: string) {
        await directus.items('messages').deleteOne(id);
    }

    static async updateMessage(id: string, message: string) {
        return (await directus.items('messages').updateOne(id, {message: message}));
    }
}