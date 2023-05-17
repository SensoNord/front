import { useEffect, useState } from 'react';
import { FileType, FolderType } from '@directus/sdk';
import LoadingSpinner from '../../Component/LoadingSpinner';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import {
    fetchFolderById,
    fetchFolderByParent,
    setActualFolder,
} from '../../slicers/folder-slice';
import { deleteFileById, fetchFileByFolder } from '../../slicers/file-slice';

type Props = {
    callbackOnClick?: Function;
    showDelete?: boolean;
    startingFolderId?: string;
};

export default function DisplayFiles(props: Props) {
    const { callbackOnClick, showDelete, startingFolderId } = props;

    const rootFolder = { id: '', name: 'Root', parent: '' } as FolderType;
    const [isLoading, setIsLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [tmpFile, setTmpFile] = useState<FileType | null>(null);

    const dispatch = useAppDispatch();
    const { actualFolder, folderList } = useAppSelector(state => state.folder);
    const { fileList } = useAppSelector(state => state.file);

    // const [showPopup2, setShowPopup2] = useState(false);
    // const [tmpFolder, setTmpFolder] = useState(emptyFolderType);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            let parentId = null;
            if (startingFolderId) {
                await dispatch(fetchFolderById(startingFolderId));
                parentId = actualFolder.id;
            }
            await dispatch(fetchFolderByParent(parentId));
            await dispatch(fetchFileByFolder(parentId));
            setIsLoading(false);
        };
    
        fetchData();
    }, []);

    const handleClickFolder = async (newFolder: FolderType) => {
        console.log("pass")
        setIsLoading(true);
        await dispatch(fetchFolderByParent(newFolder.id));
        await dispatch(fetchFileByFolder(newFolder.id));
        dispatch(setActualFolder(newFolder));
        setIsLoading(false);
    };

    const handleClickBack = async () => {
        if (actualFolder.parent === '') return;
        setIsLoading(true);
        await dispatch(fetchFolderByParent(actualFolder.parent));
        await dispatch(fetchFileByFolder(actualFolder.parent));
        if (actualFolder.parent === null) {
            dispatch(setActualFolder(rootFolder));
        } else {
            await dispatch(fetchFolderById(actualFolder.parent));
        }
        setIsLoading(false);
    };

    const quitPopup = () => {
        setShowPopup(false);
    };

    const deleteFile = async () => {
        if (!tmpFile) return;
        await dispatch(deleteFileById(tmpFile.id));
        setShowPopup(false);
    }

    return (
        <>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div>
                    <div onClick={handleClickBack} className={'cursor-pointer'}>
                        Dossier actuel : {actualFolder.name}
                    </div>
                    {folderList && (
                        <div>
                            {folderList.map(folder => {
                                return (
                                    <>
                                        <div
                                            onClick={() =>
                                                handleClickFolder(folder)
                                            }
                                            className={'cursor-pointer'}
                                        >
                                            Dossier : {folder.name}
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    )}
                    {fileList && (
                        <div>
                            {fileList.map(file => {
                                return (
                                    <>
                                        <div
                                            onClick={() => {
                                                if (callbackOnClick)
                                                    callbackOnClick(file);
                                            }}
                                            className={'cursor-pointer'}
                                        >
                                            Fichier : {file.filename_download}
                                        </div>
                                        {showDelete && (
                                            <div>
                                                <button
                                                    className={
                                                        'bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 w-24 rounded'
                                                    }
                                                    onClick={() => {
                                                        setShowPopup(true);
                                                        setTmpFile(file);
                                                    }}
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        )}
                                    </>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
            {showPopup &&
                createPortal(
                    <div className={'alertContainer'}>
                        <div className={'alertPopup text-center'}>
                            <h1>
                                Êtes-vous sur de vouloir supprimer ce fichier ?
                            </h1>
                            <h3>"{tmpFile!.filename_download}"</h3>
                            <div className={'flex justify-evenly'}>
                                <button
                                    className={
                                        'bg-green-500 hover:bg-green-700 text-white w-1/6 font-bold py-2 px-4 rounded'
                                    }
                                    onClick={deleteFile}
                                >
                                    Oui
                                </button>
                                <button
                                    className={
                                        'bg-red-500 hover:bg-red-700 text-white w-1/6 font-bold py-2 px-4 rounded'
                                    }
                                    onClick={quitPopup}
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.getElementById('modal-root') as HTMLElement,
                )}
        </>
    );
}
