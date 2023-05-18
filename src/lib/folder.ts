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

    static async getfileById(file_id: string): Promise <any> {
        return (await directus.files.readOne(file_id))
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

    static async uploadFile(file: File | null, folder_id: string, subject_id: string | null = null, conv_id: string | null = null): Promise<ModifiedFileType | null> {
        if (!file) return null;

        function getFormData(object: any) {
            const formData = new FormData();
            Object.keys(object).forEach(key => formData.append(key, object[key]));
            return formData;
        }

        const formData = getFormData({file});
        let createFile = await directus.files.createOne(formData);
        if (folder_id !== '') {
            if (createFile) {
                let options: {};
                if (subject_id !== null) {
                    options = {"subject": [{"subjects_id": subject_id}], "folder": folder_id};
                } else if (conv_id !== null) {
                    options = {"conversation": [{"conversations_id": conv_id}], "folder": folder_id};
                } else {
                    options = {"folder": folder_id};
                }
                let updateFile = await directus.files.updateOne(createFile.id, options);
                return updateFile as unknown as ModifiedFileType;
            } else {
                return null;
            }
        } else {
            return createFile as unknown as ModifiedFileType;
        }
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

    static async deleteFile(file: ModifiedFileType) {
        await directus.files.deleteOne(file.id);
    }
}