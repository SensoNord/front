import {ModifiedFileType} from "../type/ModifiedFileType";
import {directus, directusUrl} from "../services/directus";

export default class Folder {

    static async getFilesList(file_id: string): Promise<any> {
        return (await directus.files.readByQuery({
            filter: {
                "id": {
                    "_eq": file_id
                }
            },
            fields: [
                "id",
                "type",
                "filename_download",
            ]
        }))
    }

    static async getFilesByFolder(folder_id: string | null): Promise<any> {
        return (await directus.files.readByQuery({
            filter: {
                "folder": folder_id ? {"_eq": folder_id} : {"_null": true}
            },
            fields: [
                "id",
                "filename_download",
                "type"
            ]
        }))
    }

    static async getFolderByParent(parent_id: string | null): Promise<any> {
        return (await directus.folders.readByQuery({
            filter: {
                "parent": parent_id ? {"_eq": parent_id} : {"_null": true}
            },
            fields: [
                "id",
                "name",
                "parent"
            ]
        }))
    }

    static async getFolderById(parent: string): Promise<any> {
        return (await directus.folders.readOne(parent))
    }

    static async uploadFile(file: File | null, subject_id: string, folder_id: string, messageId: string, linkType: string): Promise<ModifiedFileType | string | null | undefined> {
        if (!file) return 'No file uploaded';
        function getFormData(object: any) {
            const formData = new FormData();
            Object.keys(object).forEach(key => formData.append(key, object[key]));
            return formData;
        }
        const formData = getFormData({file});
        let responseCreateFile = (await directus.files.createOne(formData));
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
            return responseUpdateFile as unknown as ModifiedFileType;
        }
        return 'No file uploaded';
    }

    static downloadFile(file: ModifiedFileType) {
        fetch(directusUrl + 'assets/' + file.id + '?download', {
            method: 'GET',
            headers: {
                'Content-Type': file.type,
                'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
            },
        })
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(
                    new Blob([blob]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    file.filename_download,
                );
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
            });
    }
}