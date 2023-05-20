import { useEffect, useRef, useState } from 'react';
import { MessageResponseType } from '../../../types/Chat/MessageResponseType';
import {
    ModifiedFileType,
    emptyDirectusFileType,
} from '../../../types/Chat/ModifiedFileType';
import { createPortal } from 'react-dom';
import LoadingSpinner from '../../LoadingSpinner';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import { downloadFile, fetchFileById } from '../../../slicers/file-slice';
import {
    deleteResponseById,
    setCurrentSubjectDisplayWithAllRelatedData,
    updateResponseMessageById,
} from '../../../slicers/subject-slice';
import { ErrorType, isErrorType } from '../../../types/Request/ErrorType';
import { PayLoadUpdateResponse } from '../../../slicers/subject-slice-helper';

type Props = {
    subjectId: string;
    response: MessageResponseType;
};

export default function Response(props: Props) {
    const { response, subjectId } = props;
    const dispatch = useAppDispatch();
    const { connectedUser, connectedUserRole } = useAppSelector(state => state.auth);

    const [downloadButton, setDownloadButton] = useState(false);
    const [showFileDeleted, setShowFileDeleted] = useState(false);
    const [file, setFile] = useState(emptyDirectusFileType);
    const [showPopup, setShowPopup] = useState(false);

    const [isAdministrator, setIsAdministrator] = useState(
        null as boolean | null,
    );
    const [isResponseOwner, setIsResponseOwner] = useState(
        null as boolean | null,
    );

    const [responseIsBeingEdited, setResponseIsBeingEdited] = useState(false);
    const textAreaRef = useRef(null) as { current: any };

    const [isLoaded, setIsLoaded] = useState(true);

    useEffect(() => {
        setIsAdministrator(connectedUserRole.name === 'Administrator');
        setIsResponseOwner(connectedUser.id === response.user_created.id);
    }, [connectedUser, connectedUserRole]);

    useEffect(() => {
        async function fetchFile() {
            if (
                response.file_id !== '' &&
                response.file_id !== null &&
                response.file_id !== undefined
            ) {
                let filesPayload = await dispatch(
                    fetchFileById(response.file_id),
                );
                let files = filesPayload.payload as
                    | ModifiedFileType
                    | ErrorType;
                if (!isErrorType(files)) {
                    setDownloadButton(true);
                    setShowFileDeleted(false);
                    setFile(files);
                } else {
                    setShowFileDeleted(true);
                    setDownloadButton(false);
                    setFile(emptyDirectusFileType);
                }
            }
            setIsLoaded(true);
        }
        fetchFile();
    }, []);

    function quitPopup() {
        setShowPopup(false);
    }

    async function deleteResponse() {
        await dispatch(deleteResponseById(response.id));
        dispatch(setCurrentSubjectDisplayWithAllRelatedData(subjectId))
        quitPopup();
    }

    function editResponse() {
        setResponseIsBeingEdited(true);
    }

    async function updateMessage() {
        await dispatch(
            updateResponseMessageById({
                id: response.id,
                message: textAreaRef.current.value,
            } as PayLoadUpdateResponse),
        );
        dispatch(setCurrentSubjectDisplayWithAllRelatedData(subjectId))
        setResponseIsBeingEdited(false);
    }

    async function handleDownloadFile() {
        await dispatch(downloadFile(file as ModifiedFileType));
    }

    return (
        <>
            {!isLoaded ? (
                <LoadingSpinner />
            ) : (
                <>
                    <div
                        className={
                            'border-black border-2 mt-10 mb-4 px-4 py-2 rounded-lg'
                        }
                    >
                        <div className={'grid grid-cols-12'}>
                            <div className={'col-span-11'}>
                                {!responseIsBeingEdited && (
                                    <p
                                        className={
                                            'text-1xl whitespace-pre-wrap'
                                        }
                                    >
                                        {response.message}
                                    </p>
                                )}
                                {responseIsBeingEdited && (
                                    <div className={'grid grid-cols-12 m-2'}>
                                        <textarea
                                            className={
                                                'text-1xl whitespace-pre-wrap col-span-11 border border-black'
                                            }
                                            defaultValue={response.message}
                                            rows={4}
                                            ref={textAreaRef}
                                            autoFocus={responseIsBeingEdited}
                                            onFocus={e =>
                                                e.currentTarget.setSelectionRange(
                                                    e.currentTarget.value
                                                        .length,
                                                    e.currentTarget.value
                                                        .length,
                                                )
                                            }
                                        ></textarea>
                                        <div>
                                            <button
                                                className={
                                                    'col-start-12 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2.5 m-1 rounded'
                                                }
                                                onClick={() =>
                                                    setResponseIsBeingEdited(
                                                        false,
                                                    )
                                                }
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                className={
                                                    'col-start-11 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2.5 m-1 rounded'
                                                }
                                                onClick={updateMessage}
                                            >
                                                Valider
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={'col-span-1'}>
                                {isResponseOwner && !responseIsBeingEdited && (
                                    <button
                                        className={
                                            'bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-1 w-24 rounded'
                                        }
                                        onClick={editResponse}
                                    >
                                        Modifier
                                    </button>
                                )}
                                {(isResponseOwner || isAdministrator) &&
                                    !responseIsBeingEdited && (
                                        <button
                                            className={
                                                'bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 w-24 rounded'
                                            }
                                            onClick={() => setShowPopup(true)}
                                        >
                                            Supprimer
                                        </button>
                                    )}
                            </div>
                        </div>
                        {downloadButton ? (
                            <button
                                onClick={handleDownloadFile}
                                className={'underline underline-offset-4'}
                            >
                                Télécharger {file.filename_download}
                            </button>
                        ) : null}
                        {showFileDeleted ? (
                            <p className={'text-red-500'}>Fichier supprimé</p>
                        ) : null}
                        <div className={'text-right'}>
                            le{' '}
                            {new Date(
                                response.date_created,
                            ).toLocaleDateString()}{' '}
                            à{' '}
                            {new Date(
                                response.date_created,
                            ).toLocaleTimeString()}{' '}
                            par{' '}
                            {response.user_created.first_name +
                                ' ' +
                                response.user_created.last_name}
                        </div>
                    </div>
                    {showPopup &&
                        createPortal(
                            <div className={'alertContainer'}>
                                <div className={'alertPopup text-center'}>
                                    <h1>
                                        Êtes-vous sur de vouloir supprimer cette
                                        réponse ?
                                    </h1>
                                    <h3>"{response.message}"</h3>
                                    <div className={'flex justify-evenly'}>
                                        <button
                                            className={
                                                'bg-green-500 hover:bg-green-700 text-white w-1/6 font-bold py-2 px-4 rounded'
                                            }
                                            onClick={deleteResponse}
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
                            document.getElementById(
                                'modal-root',
                            ) as HTMLElement,
                        )}
                </>
            )}
        </>
    );
}
