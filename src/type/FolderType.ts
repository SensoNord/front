export type FolderType = {
    id: string;
    name: string;
    parent: string
}

const emptyFolderType: FolderType = {
    id: "",
    name: "",
    parent: ""
}

export {emptyFolderType};
