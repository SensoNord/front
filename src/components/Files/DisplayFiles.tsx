import { useCallback, useEffect, useMemo, useState } from 'react';
import { FolderType, UserType } from '@directus/sdk';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import { fetchFolderById, fetchFolderByParent, folderByParentPayload } from '../../slicers/file/folder-slice';
import { deleteFileById, fetchFileByFolder } from '../../slicers/file/file-slice';
import { ModifiedFileType } from '../../types/File/ModifiedFileType';
import NameAndDate from '../Field/NameAndDate';
import LoadingSpinner from '../LoadingSpinner';

type Props = {
    callbackOnClick?: Function;
    showDelete?: boolean;
    startingFolderId?: string;
    compactMode?: boolean;
    setCurrentDisplayedFolder?: Function;
};

export default function DisplayFiles(props: Props) {
    const { callbackOnClick, showDelete, startingFolderId, compactMode, setCurrentDisplayedFolder } = props;

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
    const { connectedUser } = useAppSelector(state => state.auth);

    const getFolderById = useCallback(
        async (id: string) => {
            const folderPayload = await dispatch(fetchFolderById(id));
            const newFolder = folderPayload.payload as FolderType;
            return newFolder;
        },
        [dispatch],
    );

    const [folderListToDisplay, setFolderListToDisplay] = useState<FolderType[]>([rootFolder]);

    const handleClickFolder = (newFolder: FolderType) => {
        if (newFolder.id === actualFolder.id) return;
        setIsDataLoaded(false);
        setActualFolder(newFolder);
        if (folderListToDisplay.filter(folder => folder.id === newFolder.id).length === 0) {
            setFolderListToDisplay([...folderListToDisplay, newFolder]);
        } else {
            setFolderListToDisplay(folderListToDisplay.slice(0, folderListToDisplay.indexOf(newFolder) + 1));
        }
        if (setCurrentDisplayedFolder) setCurrentDisplayedFolder(newFolder);
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
                let tmpFolder = await getFolderById(startingFolderId);
                setActualFolder(tmpFolder);
                const getParentsList = async (folder: FolderType): Promise<any> => {
                    if (folder.parent) {
                        const parentFolder = await getFolderById(folder.parent);
                        return [...(await getParentsList(parentFolder)), parentFolder];
                    } else {
                        return [rootFolder];
                    }
                };
                setFolderListToDisplay([...(await getParentsList(tmpFolder)), tmpFolder]);
            } else {
                setActualFolder(rootFolder);
            }
        };

        getActualFolder();
    }, [dispatch, startingFolderId, rootFolder, getFolderById]);

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(
                fetchFolderByParent({
                    parentId: actualFolder.id,
                    connectedUserId: connectedUser.id,
                } as folderByParentPayload),
            );
            await dispatch(fetchFileByFolder(actualFolder.id));
            setIsDataLoaded(true);
        };

        fetchData();
    }, [dispatch, actualFolder, connectedUser.id]);

    return (
        <>
            {!isDataLoaded ? (
                <>
                <LoadingSpinner />
                </>
            ) : (
                <div className={'h-full overflow-y-scroll'}>
                    <div className={'cursor-pointer flex mb-4 text-2xl'}>
                        {folderListToDisplay.map((folder, index) => {
                            return (
                                <div key={folder.id} onClick={() => handleClickFolder(folder)}>
                                    {folder.name}
                                    {index === folderListToDisplay.length - 1 ? '' : ' >'}&nbsp;
                                </div>
                            );
                        })}
                    </div>
                    <div className={'grid grid-cols-12 w-full gap-2'}>
                        <div className={'grid grid-cols-12 col-span-12 gap-2 w-full text-xl'}>
                            <div className={'col-span-6'}>Nom</div>
                            <div className={compactMode ? 'col-span-6' : 'col-span-4'}>Dernière modification</div>
                            {!compactMode && <div className={'col-span-2'}></div>}
                        </div>
                        <div className={'col-span-12 w-full'}>
                            {folderList && (
                                <>
                                    {folderList.map((folder, index) => {
                                        return (
                                            <>
                                                <div
                                                    key={index}
                                                    onClick={() => handleClickFolder(folder)}
                                                    className={`cursor-pointer flex w-full ${
                                                        compactMode ? '' : 'my-2'
                                                    }`}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="w-6 h-6 cursor-pointer hover:text-gray-500"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                                                        />
                                                    </svg>
                                                    {folder.name}
                                                </div>
                                                {index === folderList.length - 1 ? '' : <hr></hr>}
                                            </>
                                        );
                                    })}
                                </>
                            )}
                            {fileList && (
                                <>
                                    {fileList.map((file, index) => {
                                        return (
                                            <>
                                                <div key={index} className={'grid grid-cols-12 my-2 w-full'}>
                                                    <div
                                                        onClick={() => {
                                                            if (callbackOnClick) callbackOnClick(file);
                                                        }}
                                                        className={`cursor-pointer flex col-span-6 ${
                                                            compactMode ? '' : 'my-2'
                                                        }`}
                                                    >
                                                        {file.type.startsWith('image') ? (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={1.5}
                                                                stroke="currentColor"
                                                                className="w-6 h-6 cursor-pointer hover:text-gray-500"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                                                />
                                                            </svg>
                                                        ) : file.type.startsWith('text') ? (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={1.5}
                                                                stroke="currentColor"
                                                                className="w-6 h-6 cursor-pointer hover:text-gray-500"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                                                />
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={1.5}
                                                                stroke="currentColor"
                                                                className="w-6 h-6 cursor-pointer hover:text-gray-500"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                                                />
                                                            </svg>
                                                        )}
                                                        {file.filename_download}
                                                    </div>
                                                    <div className={compactMode ? 'col-span-6' : 'col-span-3'}>
                                                        {/*{(new Date(file.modified_on)).toLocaleString('fr-FR')}*/}
                                                        {file.modified_on !== null && file.modified_by !== null ? (
                                                            <NameAndDate
                                                                date_created={new Date(file.modified_on)}
                                                                user_created={
                                                                    {
                                                                        first_name: file.modified_by.first_name,
                                                                        last_name: file.modified_by.last_name,
                                                                    } as UserType
                                                                }
                                                            ></NameAndDate>
                                                        ) : (
                                                            <NameAndDate
                                                                date_created={new Date(file.uploaded_on)}
                                                                user_created={
                                                                    {
                                                                        first_name: file.uploaded_by.first_name,
                                                                        last_name: file.uploaded_by.last_name,
                                                                    } as UserType
                                                                }
                                                            ></NameAndDate>
                                                        )}
                                                    </div>
                                                    {!compactMode && (
                                                        <div className={'col-span-3 flex justify-center'}>
                                                            {showDelete && file.uploaded_by.id === connectedUser.id && (
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
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                {index === fileList.length - 1 ? '' : <hr></hr>}
                                            </>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showPopup &&
                createPortal(
                    <div className={'alertContainer'}>
                        <div className={'alertPopup text-center'}>
                            <h1>Êtes-vous sur de vouloir supprimer ce fichier ?</h1>
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
