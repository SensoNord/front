import { useEffect, useRef, useState } from 'react';
import DisplayFiles from '../../components/Files/DisplayFiles';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import { fetchSubjectByFolderId } from '../../slicers/subject-slice';
import {
    createFile,
    downloadFile,
    resetCreatedFile,
    updateFile,
} from '../../slicers/file-slice';
import { setActualFolder } from '../../slicers/folder-slice';
import '../../styles/Forum.css';
import { FileType } from '@directus/sdk';

export default function Drive() {
    const [showPopup, setShowPopup] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    // const [folderId, setFolderId] = useState<string>('');
    const [uploadIsEnabled, setUploadIsEnabled] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { actualFolder } = useAppSelector(state => state.folder);
    const { subjectList } = useAppSelector(state => state.subject);
    const { createdFile } = useAppSelector(state => state.file);
    const [isFileCreated, setIsFileCreated] = useState<boolean>(false);

    const fileRef = useRef(null) as { current: any };

    useEffect(() => {
        dispatch(setActualFolder({ id: '', name: 'Root', parent: '' }));
    }, [dispatch]);

    useEffect(() => {
        const doUpdateFile = async () => {
            if (
                actualFolder.id !== '' &&
                createdFile &&
                subjectList.length !== 0 &&
                isFileCreated
            ) {
                let subject = subjectList[0];
                await dispatch(
                    updateFile({
                        file: createdFile,
                        subjectId: subject.id,
                        folderId: actualFolder.id,
                    }),
                );
                setIsFileCreated(false);
                dispatch(resetCreatedFile());
            }
        }

        doUpdateFile();
    }, [createdFile, isFileCreated, dispatch, actualFolder, subjectList]);

    useEffect(() => {
        const doFetchSubjectByFolderId = async () => {
            if (actualFolder.id !== '') {
                await dispatch(fetchSubjectByFolderId(actualFolder.id));
            }
        }

        doFetchSubjectByFolderId();
    }, [actualFolder, dispatch]);

    useEffect(() => {
        setUploadIsEnabled(subjectList && subjectList.length !== 0);
    }, [subjectList]);

    function newFile() {
        setShowPopup(true);
    }

    const handleAddNewFile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const responseMessage = (
            e.currentTarget[0] as HTMLInputElement
        ).value.trimEnd();

        if (
            uploadedFile?.size === 0 &&
            uploadedFile.name.length === 0 &&
            responseMessage.length === 0
        ) {
            alert('Vous ne pouvez pas envoyez de message vide');
            return;
        }

        if (uploadedFile?.size !== 0 || uploadedFile.name.length !== 0) {
            await dispatch(fetchSubjectByFolderId(actualFolder.id));

            if (uploadedFile) {
                const formData = getFormData({ uploadedFile });
                await dispatch(createFile(formData));
                setIsFileCreated(true);
            }
        }

        setShowPopup(false);
    };

    function getFileFromComputer(e: { target: { files: any } }) {
        const f = e.target.files[0];
        setUploadedFile(f);
    }

    function getFormData(object: any) {
        const formData = new FormData();
        Object.keys(object).forEach(key => formData.append(key, object[key]));
        return formData;
    }

    const handleDownloadFile = async (file: FileType) => {
        await dispatch(downloadFile(file));
    };

    return (
        <>
            <div>
                <button
                    className={`bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded${
                        !uploadIsEnabled ? ' cursor-not-allowed' : ''
                    }`}
                    disabled={!uploadIsEnabled}
                    onClick={newFile}
                >
                    Ajouter un fichier
                </button>
                <DisplayFiles
                    showDelete={true}
                    callbackOnClick={handleDownloadFile}
                ></DisplayFiles>
            </div>
            {showPopup &&
                createPortal(
                    <div className={'alertContainer'}>
                        <div className={'alertPopup text-center'}>
                            <h1>Ajout d'un fichier</h1>
                            <form
                                id="upload-file"
                                className={'grid grid-cols-12 m-2'}
                                onSubmit={handleAddNewFile}
                            >
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
                                        'col-span-6 w-8/12 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mb-2 mx-auto rounded'
                                    }
                                    onClick={() => setShowPopup(false)}
                                >
                                    Annuler
                                </button>
                                <button
                                    className={
                                        'col-span-6 w-8/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 mx-auto rounded'
                                    }
                                    type={'submit'}
                                >
                                    Envoyer
                                </button>
                            </form>
                        </div>
                    </div>,
                    document.getElementById('modal-root') as HTMLElement,
                )}
        </>
    );
}
