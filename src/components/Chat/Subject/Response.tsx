import { useEffect, useRef, useState } from 'react';
import { ResponseType } from '../../../types/Chat/ResponseType';
import {
    ModifiedFileType,
} from '../../../types/File/ModifiedFileType';
import { createPortal } from 'react-dom';
import LoadingSpinner from '../../LoadingSpinner';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import { downloadFile } from '../../../slicers/file/file-slice';
import {
    deleteResponseById,
    setCurrentSubjectDisplayWithAllRelatedData,
    updateResponseMessageById,
} from '../../../slicers/chat/subject-slice';
import { PayLoadUpdateSubjectResponse } from '../../../slicers/chat/subject-slice-helper';
import { useFetchFile } from '../../../customHook/useFetchFile';
import { FileTypeWithStatus } from '../../../types/File/FileTypeWithStatus';
import DownloadableFile from '../DownloadableFile';
import NameAndDate from '../../Field/NameAndDate';

type Props = {
    subjectId: string;
    response: ResponseType;
};

export default function Response(props: Props) {
    const { response, subjectId } = props;
    const dispatch = useAppDispatch();
    const { connectedUser, connectedUserRole } = useAppSelector(state => state.auth);

    const [file, setFile] = useState<FileTypeWithStatus>({} as FileTypeWithStatus);
    const [showPopup, setShowPopup] = useState(false);

    const [isAdministrator, setIsAdministrator] = useState(
        null as boolean | null,
    );
    const [isResponseOwner, setIsResponseOwner] = useState(
        null as boolean | null,
    );

    const [responseIsBeingEdited, setResponseIsBeingEdited] = useState(false);
    const textAreaRef = useRef(null) as { current: any };

    // const [isLoaded, setIsLoaded] = useState(true);
    const isLoaded = true;

    useEffect(() => {
        setIsAdministrator(connectedUserRole.name === 'Administrator');
        setIsResponseOwner(connectedUser.id === response.user_created.id);
    }, [connectedUser, connectedUserRole, response.user_created.id]);

    useFetchFile({
        file_id: response.file_id,
        setFile: setFile,
    })

    function quitPopup() {
        setShowPopup(false);
    }

    async function deleteResponse() {
        await dispatch(deleteResponseById(response.id));
        dispatch(setCurrentSubjectDisplayWithAllRelatedData(subjectId))
        quitPopup();
    }

    async function updateMessage() {
        await dispatch(
            updateResponseMessageById({
                id: response.id,
                message: textAreaRef.current.value,
            } as PayLoadUpdateSubjectResponse),
        );
        dispatch(setCurrentSubjectDisplayWithAllRelatedData(subjectId))
        setResponseIsBeingEdited(false);
    }

    function editResponse() {
        setResponseIsBeingEdited(true);
    }

    async function handleDownloadFile() {
        await dispatch(downloadFile(file.file as ModifiedFileType));
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
                        < DownloadableFile
                            file={file}
                            handleDownloadFile={handleDownloadFile}
                        />
                        <div className={'text-right'}>
                            < NameAndDate
                                user_created={response.user_created}
                                date_created={response.date_created}
                            />
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
