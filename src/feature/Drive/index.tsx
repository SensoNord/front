import React, { useEffect, useRef, useState } from 'react';
import DisplayFiles from '../../components/Files/DisplayFiles';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import { fetchSubjectByFolderId } from '../../slicers/chat/subject-slice';
import { UpdateFilePayload, createFile, downloadFile, updateFile } from '../../slicers/file/file-slice';
import '../../styles/Popup.css';
import { ModifiedFileType } from '../../types/File/ModifiedFileType';
import { FileType } from '@directus/sdk';
import { SubjectType } from '../../types/Chat/SubjectType';
import { fetchConversationByFolderId } from '../../slicers/chat/conversation-slice';
import { ConversationType } from '../../types/Chat/ConversationType';

export default function Drive() {
    const [showPopup, setShowPopup] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadIsEnabled, setUploadIsEnabled] = useState<boolean>(false);
    const [currentDisplayedFolder, setCurrentDisplayedFolder] = useState<FileType | null>(null);
    const dispatch = useAppDispatch();
    const { subjectListForFolder } = useAppSelector(state => state.subject);

    const { connectedUser } = useAppSelector(state => state.auth);

    const fileRef = useRef(null) as { current: any };

    useEffect(() => {
        const doFetchSubjectByFolderId = async () => {
            if (currentDisplayedFolder && currentDisplayedFolder.id !== '') {
                let currentSubject = (await dispatch(fetchSubjectByFolderId(currentDisplayedFolder.id)))
                    .payload as SubjectType[];
                if (currentSubject.length !== 0) {
                    if (currentSubject['0']?.user_list.some(user => user.directus_users_id.id === connectedUser.id)) {
                        setUploadIsEnabled(true);
                    } else {
                        setUploadIsEnabled(false);
                    }
                } else {
                    let currentConv = (await dispatch(fetchConversationByFolderId(currentDisplayedFolder.id)))
                        .payload as ConversationType[];
                    if (currentConv.length !== 0) {
                        if (currentConv['0']?.user_list.some(user => user.directus_users_id.id === connectedUser.id)) {
                            setUploadIsEnabled(true);
                        } else {
                            setUploadIsEnabled(false);
                        }
                    } else {
                        setUploadIsEnabled(false);
                    }
                }
            } else {
                setUploadIsEnabled(false);
            }
        };

        doFetchSubjectByFolderId();
    }, [dispatch, connectedUser.id, currentDisplayedFolder]);

    function newFile() {
        setShowPopup(true);
    }

    const handleAddNewFile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const responseMessage = (e.currentTarget[0] as HTMLInputElement).value.trimEnd();

        if (uploadedFile?.size === 0 && uploadedFile.name.length === 0 && responseMessage.length === 0) {
            alert('Vous ne pouvez pas envoyez de message vide');
            return;
        }

        if (uploadedFile?.size !== 0 || uploadedFile.name.length !== 0) {
            await dispatch(fetchSubjectByFolderId(subjectListForFolder[0].folder_id));

            if (uploadedFile && subjectListForFolder[0].folder_id !== '' && subjectListForFolder.length !== 0) {
                const createdFilePayload = await dispatch(createFile(uploadedFile));
                const createdFile = createdFilePayload.payload as ModifiedFileType;
                await dispatch(
                    updateFile({
                        file: createdFile,
                        chatId: subjectListForFolder[0].id,
                        folderId: subjectListForFolder[0].folder_id,
                        chatType: 'subject',
                    } as UpdateFilePayload),
                );
            }
        }

        setShowPopup(false);
    };

    function getFileFromComputer(e: { target: { files: any } }) {
        const f = e.target.files[0];
        setUploadedFile(f);
    }

    const handleDownloadFile = async (file: ModifiedFileType) => {
        await dispatch(downloadFile(file));
    };

    return (
        <>
            <div className={'grid grid-cols-6'}>
                <div className={'col-start-5 flex justify-center items-start'}>
                    <button
                        className={`bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded z-10 ${
                            !uploadIsEnabled ? 'cursor-not-allowed' : ''
                        }`}
                        disabled={!uploadIsEnabled}
                        onClick={newFile}
                    >
                        Ajouter un fichier
                    </button>
                </div>
                <div className={'col-span-6'} style={{ marginTop: '-2rem' }}>
                    <DisplayFiles
                        showDelete={true}
                        callbackOnClick={handleDownloadFile}
                        setCurrentDisplayedFolder={setCurrentDisplayedFolder}
                    />
                </div>
            </div>
            {showPopup &&
                createPortal(
                    <div className={'alertContainer'}>
                        <div className={'alertPopup text-center'}>
                            <h1>Ajout d'un fichier</h1>
                            <form id="upload-file" className={'grid grid-cols-12 m-2'} onSubmit={handleAddNewFile}>
                                <label className={'col-span-12 m-2 p-2'}>
                                    Fichier
                                    <input
                                        type={'file'}
                                        name={'file'}
                                        id={'file'}
                                        className={'mx-2'}
                                        ref={fileRef}
                                        onChange={getFileFromComputer}
                                    />
                                </label>
                                <button
                                    className={
                                        'col-span-6 w-8/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 mx-auto rounded'
                                    }
                                    type={'submit'}
                                >
                                    Envoyer
                                </button>
                                <button
                                    className={
                                        'col-span-6 w-8/12 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mb-2 mx-auto rounded'
                                    }
                                    onClick={() => setShowPopup(false)}
                                >
                                    Annuler
                                </button>
                            </form>
                        </div>
                    </div>,
                    document.getElementById('modal-root') as HTMLElement,
                )}
        </>
    );
}
