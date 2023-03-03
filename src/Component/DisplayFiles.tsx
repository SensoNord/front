import {FC, useEffect, useState} from "react";
import {emptyDirectusFileType} from "../type/ModifiedFileType";
import folder from "../lib/folder";
import forum from "../lib/forum";
import {emptyFolderType} from "../type/DirectusType";
import {FolderType} from "@directus/sdk";
import LoadingSpinner from "./LoadingSpinner";

const DisplayFiles: FC<{ callback: Function }> = ({callback}) => {
    const [files, setFiles] = useState(new Array(emptyDirectusFileType));
    const [folders, setFolders] = useState(new Array(emptyFolderType));
    const rootFolder = {id: "", name: "Root", parent: ""} as FolderType;
    const [actualFolder, setActualFolder] = useState(rootFolder);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        forum.connection().then(async () => {
            const foldersResponse = await folder.getFolderByParent(null)
            setFolders(foldersResponse.data);
            const filesResponse = await folder.getFilesByFolder(null)
            setFiles(filesResponse.data);
            setIsLoading(false);
        });
    }, []);

    function handleClickFolder(newFolder: FolderType) {
        folder.getFolderByParent(newFolder.id).then((foldersResponse) => {
            setFolders(foldersResponse.data);
        });
        folder.getFilesByFolder(newFolder.id).then((filesResponse) => {
            setFiles(filesResponse.data);
        });
        setActualFolder(newFolder);
    }

    function handleClickBack() {
        folder.getFolderByParent(actualFolder.parent).then((foldersResponse) => {
            setFolders(foldersResponse.data);
        });
        folder.getFilesByFolder(actualFolder.parent).then((filesResponse) => {
            setFiles(filesResponse.data);
        });
        if (actualFolder.parent === null) {
            setActualFolder(rootFolder);
        } else {
            folder.getFolderById(actualFolder.parent).then((folderResponse) => {
                setActualFolder(folderResponse);
            });
        }
    }

    return (
        <>
            {
                isLoading ? <LoadingSpinner /> : (
                    <div>
                        <div onClick={handleClickBack} className={"cursor-pointer"}>
                            {actualFolder.name}
                        </div>
                        {
                            folders && (
                                <div>
                                    {folders.map((folder) => {
                                        return (
                                            <div onClick={() => handleClickFolder(folder)} className={"cursor-pointer"}>
                                                Dossier : {folder.name}
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        }
                        {
                            files && (
                                <div>
                                    {files.map((file) => {
                                        return (
                                            <div onClick={() => callback(file)} className={"cursor-pointer"}>
                                                Fichier : {file.filename_download}
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        }
                    </div>
                )
            }
        </>
    )
}

export default DisplayFiles;