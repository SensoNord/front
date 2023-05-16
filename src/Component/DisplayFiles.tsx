import {useEffect, useState} from "react";
import folder from "../lib/folder";
import forum from "../lib/forum";
import {FileType, FolderType} from "@directus/sdk";
import LoadingSpinner from "./LoadingSpinner";
import {createPortal} from "react-dom";
import { useAppDispatch, useAppSelector } from "../App/hooks";
import { fetchFolderById, fetchFolderByParent, setActualFolder } from "../slicers/folder-slice";

type Props = {
    callbackOnClick?: Function;
    showDelete?: boolean;
    startingFolderId?: string;
  };

export default function DisplayFiles (props: Props) {
    const { callbackOnClick, showDelete, startingFolderId } = props;
    
    const rootFolder = {id: "", name: "Root", parent: ""} as FolderType;
    const [files, setFiles] = useState<FileType[]>([]);
    // const [folders, setFolders] = useState<FolderType[]>([]);
    // const [actualFolder, setActualFolder] = useState<FolderType>(rootFolder);
    const [isLoading, setIsLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [tmpFile, setTmpFile] = useState<FileType | null>(null);

    const dispatch = useAppDispatch();
    const { actualFolder, folderList } = useAppSelector(state => state.folder);

    // const [showPopup2, setShowPopup2] = useState(false);
    // const [tmpFolder, setTmpFolder] = useState(emptyFolderType);

    useEffect(() => {
        setIsLoading(true);
        forum.connection().then(async () => {
            let parentId = null;
            if (startingFolderId) {
                dispatch(fetchFolderById(startingFolderId));
                parentId = actualFolder.id;
            }
            dispatch(fetchFolderByParent(parentId));
            const filesResponse = await folder.getFilesByFolder(parentId);
            setFiles(filesResponse.data);
            setIsLoading(false);
        });
    }, []);

    async function handleClickFolder(newFolder: FolderType) {
        setIsLoading(true);
        dispatch(fetchFolderByParent(newFolder.id));
        let filesResponse = await folder.getFilesByFolder(newFolder.id);
        setFiles(filesResponse.data);
        dispatch(setActualFolder(newFolder));
        setIsLoading(false);
    }

    async function handleClickBack() {
        if (actualFolder.parent === '') return;
        setIsLoading(true);
        dispatch(fetchFolderByParent(actualFolder.parent));
        let filesResponse = await folder.getFilesByFolder(actualFolder.parent);
        setFiles(filesResponse.data);
        if (actualFolder.parent === null) {
            setActualFolder(rootFolder);
        } else {
            dispatch(fetchFolderById(actualFolder.parent));
        }
        setIsLoading(false);
    }

    function quitPopup() {
        setShowPopup(false);
    }

    async function deleteFile() {
        if (!tmpFile) return;
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
                            folderList && (
                                <div>
                                    {folderList.map((folder) => {
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
                            <h3>"{tmpFile!.filename_download}"</h3>
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
