export type PayLoadCreateMessage = {
    post_id: string;
    message: string;
    file_id: string | null;
};

export type PayLoadCreatePost = {
    subject_id: string;
    title: string;
    message: string;
    file_id: string | null;
};

export type PayLoadUpdatePost = {
    id: string;
    message: string;
};

export type PayLoadUpdateResponse = PayLoadUpdatePost;

export const subjectFields = [
    'id',
    'user_created.first_name',
    'user_created.last_name',
    'date_created',
    'user_updated.first_name',
    'user_updated.last_name',
    'date_updated',
    'name',
    'user_list.directus_users_id.first_name',
    'user_list.directus_users_id.last_name',
    'posts.id',
    'posts.user_created.first_name',
    'posts.user_created.last_name',
    'posts.user_created.id',
    'posts.date_created',
    'posts.user_updated.first_name',
    'posts.user_updated.last_name',
    'posts.date_updated',
    'posts.title',
    'posts.message',
    'posts.file_id',
    'posts.responses.user_created.first_name',
    'posts.responses.user_created.last_name',
    'posts.responses.user_created.id',
    'posts.responses.date_created',
    'posts.responses.user_updated.first_name',
    'posts.responses.user_updated.last_name',
    'posts.responses.user_updated.id',
    'posts.responses.date_updated',
    'posts.responses.message',
    'posts.responses.file_id',
    'posts.responses.id',
    'folder_id',
];

export const postFields = [
    'id',
    'user_created.first_name',
    'user_created.last_name',
    'user_created.id',
    'date_created',
    'user_updated.first_name',
    'user_updated.last_name',
    'user_updated.id',
    'date_updated',
    'title',
    'message',
    'file_id',
    'subject_id',
    'responses.user_created.first_name',
    'responses.user_created.last_name',
    'responses.user_created.id',
    'responses.date_created',
    'responses.user_updated.first_name',
    'responses.user_updated.last_name',
    'responses.date_updated.id',
    'responses.date_updated',
    'responses.message',
    'responses.file_id',
    'responses.id',
];

export const responseFields = [
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
    'file_id',
    'post_id',
];
