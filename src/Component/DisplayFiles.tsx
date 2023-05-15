import React, {FC, useEffect, useState} from "react";
import {emptyDirectusFileType} from "../type/ModifiedFileType";
import folder from "../lib/folder";
import forum from "../lib/forum";
import {emptyFolderType} from "../type/DirectusType";
import {FolderType} from "@directus/sdk";
import LoadingSpinner from "./LoadingSpinner";
import {createPortal} from "react-dom";

const DisplayFiles: FC<{ callbackOnClick?: Function, setFolderId?: Function, showDelete?: boolean, startingFolder?: string }> = ({callbackOnClick, setFolderId, showDelete, startingFolder}) => {
    const [files, setFiles] = useState(new Array(emptyDirectusFileType));
    const [folders, setFolders] = useState(new Array(emptyFolderType));
    const rootFolder = {id: "", name: "Root", parent: ""} as FolderType;
    const [actualFolder, setActualFolder] = useState(rootFolder);
    const [isLoading, setIsLoading] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [tmpFile, setTmpFile] = useState(emptyDirectusFileType);
    // const [showPopup2, setShowPopup2] = useState(false);
    // const [tmpFolder, setTmpFolder] = useState(emptyFolderType);

    useEffect(() => {
        setIsLoading(true);
        forum.connection().then(async () => {
            let parentId = null;
            if (startingFolder) {
                const folderReponse = await folder.getFolderById(startingFolder);
                parentId = folderReponse.id;
                setActualFolder(folderReponse);
            }
            const foldersResponse = await folder.getFolderByParent(parentId);
            setFolders(foldersResponse.data);
            const filesResponse = await folder.getFilesByFolder(parentId);
            setFiles(filesResponse.data);
            setIsLoading(false);
        });
    }, []);

    async function handleClickFolder(newFolder: FolderType) {
        setIsLoading(true);
        let foldersResponse = await folder.getFolderByParent(newFolder.id)
        setFolders(foldersResponse.data);
        let filesResponse = await folder.getFilesByFolder(newFolder.id);
        setFiles(filesResponse.data);
        setActualFolder(newFolder);
        if (setFolderId) setFolderId(newFolder.id);
        setIsLoading(false);
    }

    async function handleClickBack() {
        if (actualFolder.parent === '') return;
        setIsLoading(true);
        let foldersResponse = await folder.getFolderByParent(actualFolder.parent);
        setFolders(foldersResponse.data);
        let filesResponse = await folder.getFilesByFolder(actualFolder.parent);
        setFiles(filesResponse.data);
        if (actualFolder.parent === null) {
            setActualFolder(rootFolder);
            if (setFolderId) setFolderId('');
        } else {
            let folderResponse = await folder.getFolderById(actualFolder.parent);
            setActualFolder(folderResponse);
            if (setFolderId) setFolderId(folderResponse.id);
        }
        setIsLoading(false);
    }

    function quitPopup() {
        setShowPopup(false);
    }

    async function deleteFile() {
        await folder.deleteFile(tmpFile);
        window.location.reload();
    }

    return (
        <>
            {
                isLoading ? <LoadingSpinner/> : (
                    <div>
                        <div onClick={handleClickBack} className={"cursor-pointer"}>
                            Dossier actuel : {actualFolder.name}
                        </div>
                        {
                            folders && (
                                <div>
                                    {folders.map((folder) => {
                                        return (
                                            <>
                                                <div onClick={() => handleClickFolder(folder)} className={"cursor-pointer"}>
                                                    Dossier : {folder.name}
                                                </div>
                                            </>
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
                                            <>
                                                <div onClick={() => {
                                                    if (callbackOnClick) callbackOnClick(file)
                                                }} className={"cursor-pointer"}>
                                                    Fichier : {file.filename_download}
                                                </div>
                                                {
                                                    showDelete && (
                                                        <div>
                                                            <button className={"bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 w-24 rounded"} onClick={() => {
                                                                setShowPopup(true);
                                                                setTmpFile(file)
                                                            }}>Supprimer
                                                            </button>
                                                        </div>
                                                    )
                                                }
                                            </>
                                        )
                                    })}
                                </div>
                            )
                        }
                    </div>
                )
            }
            {
                showPopup && createPortal(
                    <div className={"alertContainer"}>
                        <div className={"alertPopup text-center"}>
                            <h1>Êtes-vous sur de vouloir supprimer ce fichier ?</h1>
                            <h3>"{tmpFile.filename_download}"</h3>
                            <div className={"flex justify-evenly"}>
                                <button className={"bg-green-500 hover:bg-green-700 text-white w-1/6 font-bold py-2 px-4 rounded"} onClick={deleteFile}>Oui</button>
                                <button className={"bg-red-500 hover:bg-red-700 text-white w-1/6 font-bold py-2 px-4 rounded"} onClick={quitPopup}>Annuler</button>
                            </div>
                        </div>
                    </div>,
                    document.getElementById('modal-root') as HTMLElement)
            }
        </>
    )
}

export default DisplayFiles;