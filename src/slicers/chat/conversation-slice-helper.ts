import { DirectusUserType } from './subject-slice-helper';

export type PayLoadUpdateConversationMessage = {
    messageId: string;
    message: string;
};

export type PayLoadCreateConversationMessage = {
    conversation_id: string;
    message: string;
    fileId: string | null;
};

export type PayLoadCreateMessage = {
    userList: DirectusUserType[];
    folderId: string | undefined;
};

export const conversationFields = [
    'id',
    'user_created.first_name',
    'user_created.last_name',
    'user_created.id',
    'date_created',
    'user_updated.first_name',
    'user_updated.last_name',
    'user_updated.id',
    'date_updated',
    'user_list.directus_users_id.first_name',
    'user_list.directus_users_id.last_name',
    'user_list.directus_users_id.id',
    'folder_id',
    'messages_list.id',
    'messages_list.user_created.first_name',
    'messages_list.user_created.last_name',
    'messages_list.user_created.id',
    'messages_list.date_created',
    'messages_list.user_updated.first_name',
    'messages_list.user_updated.last_name',
    'messages_list.user_updated.id',
    'messages_list.date_updated',
    'messages_list.message',
    'messages_list.file_id',
];

export const conversationListFields = [
    'id',
    'user_list.directus_users_id.first_name',
    'user_list.directus_users_id.last_name',
    'user_list.directus_users_id.id',
];

export const messageFields = [
    'id',
    'user_created.first_name',
    'user_created.last_name',
    'user_created.id',
    'date_created',
    'user_updated.first_name',
    'user_updated.last_name',
    'user_updated.id',
    'date_updated',
    'message',
    'conversation_id',
    'file_id',
];
