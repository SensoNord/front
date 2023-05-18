export type ModifiedFileType = {
    charset: string;
    description: string;
    duration: string;
    embed: string;
    filename_disk: string;
    filename_download: string;
    filesize: number;
    folder: string;
    height: string;
    id: string;
    location: string;
    metadata: string;
    modified_by: string;
    modified_on: string;
    storage: string;
    subject: number[] | [];
    tags: string;
    title: string;
    type: string;
    uploaded_by: string;
    uploaded_on: string;
    width: string;
};

const emptyDirectusFileType: ModifiedFileType = {
    charset: '',
    description: '',
    duration: '',
    embed: '',
    filename_disk: '',
    filename_download: '',
    filesize: 0,
    folder: '',
    height: '',
    id: '',
    location: '',
    metadata: '',
    modified_by: '',
    modified_on: '',
    storage: '',
    subject: [],
    tags: '',
    title: '',
    type: '',
    uploaded_by: '',
    uploaded_on: '',
    width: '',
};

export { emptyDirectusFileType };
