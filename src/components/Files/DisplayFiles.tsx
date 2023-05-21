import { useCallback, useEffect, useMemo, useState } from 'react';
import { FolderType } from '@directus/sdk';
import LoadingSpinner from '../LoadingSpinner';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import {
    fetchFolderById,
    fetchFolderByParent,
} from '../../slicers/file/folder-slice';
import { deleteFileById, fetchFileByFolder } from '../../slicers/file/file-slice';
import { ModifiedFileType } from '../../types/File/ModifiedFileType';

type Props = {
    callbackOnClick?: Function;
    showDelete?: boolean;
    startingFolderId?: string;
};

export default function DisplayFiles(props: Props) {
    const { callbackOnClick, showDelete, startingFolderId } = props;

    const rootFolder = useMemo(() => {
        return { id: '', name: 'Root', parent: '' } as FolderType;
    }, []);

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [tmpFile, setTmpFile] = useState<ModifiedFileType | null>(null);
    const [actualFolder, setActualFolder] = useState<FolderType>(rootFolder);

    const dispatch = useAppDispatch();
    const { folderList } = useAppSelector(state => state.folder);
    const { fileList } = useAppSelector(state => state.file);

    const getFolderById = useCallback(async (id: string) => {
        const folderPayload = await dispatch(fetchFolderById(id));
        const newFolder = folderPayload.payload as FolderType;
        return newFolder;
    }, [dispatch]);

    const handleClickFolder = (newFolder: FolderType) => {
        setIsDataLoaded(false);
        setActualFolder(newFolder);
    };

    const handleClickBack = async () => {
        if (actualFolder.parent === '') return;
        if (actualFolder.parent === null) {
            setIsDataLoaded(false);
            setActualFolder(rootFolder);
        } else {
            setIsDataLoaded(false);
            setActualFolder(await getFolderById(actualFolder.parent));
        }
    };

    const quitPopup = () => {
        setShowPopup(false);
    };

    const deleteFile = async () => {
        if (!tmpFile) return;
        await dispatch(deleteFileById(tmpFile.id));
        setShowPopup(false);
    };

    useEffect(() => {
        const getActualFolder = async () => {
            setIsDataLoaded(false);
            if (startingFolderId) {
                setActualFolder(await getFolderById(startingFolderId));
            } else {
                setActualFolder(rootFolder);
            }
        };

        getActualFolder();
    }, [dispatch, startingFolderId, rootFolder, getFolderById]);

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchFolderByParent(actualFolder.id));
            await dispatch(fetchFileByFolder(actualFolder.id));
            setIsDataLoaded(true);
        };

        fetchData();
    }, [dispatch, actualFolder])

    return (
        <>
            {!isDataLoaded ? (
                <LoadingSpinner />
            ) : (
                <div>
                    <div onClick={handleClickBack} className={'cursor-pointer'}>
                        Dossier actuel : {actualFolder?.name}
                    </div>
                    {folderList && (
                        <div>
                            {folderList.map((folder) => {
                                return (
                                    <div key={folder.id}>
                                        <div
                                            onClick={() =>
                                                handleClickFolder(folder)
                                            }
                                            className={'cursor-pointer'}
                                        >
                                            Dossier : {folder.name}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {fileList && (
                        <div>
                            {fileList.map((file) => {
                                return (
                                    <div key={file.id}>
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
                                    </div>
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
