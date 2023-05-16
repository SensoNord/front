import { ModifiedFileType } from '../type/ModifiedFileType';
import { directus } from '../libraries/directus';

const directusUrl = process.env.REACT_APP_DIRECTUS_URL as string;

export default class Folder {
    static async getFilesList(file_id: string): Promise<any> {
        return await directus.files.readByQuery({
            filter: {
                id: {
                    _eq: file_id,
                },
            },
            fields: ['id', 'type', 'filename_download'],
        });
    }

    static async getfileById(file_id: string): Promise<any> {
        return await directus.files.readOne(file_id);
    }

    static async uploadFile(
        file: File | null,
        folder_id: string,
        subject_id: string | null = null,
    ): Promise<ModifiedFileType | null> {
        if (!file) return null;

        function getFormData(object: any) {
            const formData = new FormData();
            Object.keys(object).forEach(key =>
                formData.append(key, object[key]),
            );
            return formData;
        }

        const formData = getFormData({ file });
        let createdFile = await directus.files.createOne(formData);
        if (folder_id !== '') {
            if (createdFile) {
                const options =
                    subject_id !== null
                        ? {
                              subject: [{ subjects_id: subject_id }],
                              folder: folder_id,
                          }
                        : { folder: folder_id };
                let updateFile = await directus.files.updateOne(
                    createdFile.id,
                    options,
                );
                return updateFile as unknown as ModifiedFileType;
            } else {
                return null;
            }
        } else {
            return createdFile as unknown as ModifiedFileType;
        }
    }

    static downloadFile(file: ModifiedFileType) {
        fetch(directusUrl + '/assets/' + file.id + '?download', {
            method: 'GET',
            headers: {
                'Content-Type': file.type,
                Authorization: 'Bearer ' + localStorage.getItem('auth_token'),
            },
        })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file.filename_download);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
            });
    }
}
