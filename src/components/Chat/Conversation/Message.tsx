import { useEffect, useRef, useState } from 'react';
import { ModifiedFileType } from '../../../types/File/ModifiedFileType';
import { createPortal } from 'react-dom';
import NameAndDate from '../../Field/NameAndDate';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import { downloadFile } from '../../../slicers/file/file-slice';
import {
    deleteMessageById,
    setCurrentConversationDisplayWithAllRelatedData,
    updateMessageById,
} from '../../../slicers/chat/conversation-slice';
import { ConversationType } from '../../../types/Chat/ConversationType';
import { PayLoadUpdateConversationMessage } from '../../../slicers/chat/conversation-slice-helper';
import { MessageType } from '../../../types/Chat/MessageType';
import { useFetchFile } from '../../../customHook/useFetchFile';
import { FileTypeWithStatus } from '../../../types/File/FileTypeWithStatus';
import DownloadableFile from '../DownloadableFile';

type ResponseProps = {
    conversation: ConversationType;
    message: MessageType;
    align: string;
};

export default function Response(props: ResponseProps) {
    const { conversation, message, align } = props;
    const dispatch = useAppDispatch();
    const { connectedUser } = useAppSelector(state => state.auth);

    const [file, setFile] = useState<FileTypeWithStatus>({} as FileTypeWithStatus);
    const [showPopup, setShowPopup] = useState(false);

    const [isResponseOwner, setIsResponseOwner] = useState(null as boolean | null);
    const [messageIsBeingEdited, setMessageIsBeingEdited] = useState(false);
    const textAreaRef = useRef(null) as { current: any };

    // const [isLoaded, setIsLoaded] = useState(true);
    const isLoaded = true;

    useEffect(() => {
        setIsResponseOwner(connectedUser.id === message.user_created.id);
    }, [connectedUser, message.user_created.id]);

    useFetchFile({
        file_id: message.file_id,
        setFile: setFile,
    });

    function quitPopup() {
        setShowPopup(false);
    }

    async function deleteMessage() {
        await dispatch(deleteMessageById(message.id));
        dispatch(setCurrentConversationDisplayWithAllRelatedData(conversation.id));
        quitPopup();
    }

    async function updateMessage() {
        await dispatch(
            updateMessageById({
                messageId: message.id,
                message: textAreaRef.current.value,
            } as PayLoadUpdateConversationMessage),
        );
        dispatch(setCurrentConversationDisplayWithAllRelatedData(conversation.id));
        setMessageIsBeingEdited(false);
    }

    async function handleDownloadFile() {
        await dispatch(downloadFile(file.file as ModifiedFileType));
    }

    return (
        <>
            {!isLoaded ? (
                ''
            ) : (
                <>
                    <div className={'m-4'}>
                        <div className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'}`}>
                            <div className={'flex'}>
                                <NameAndDate date_created={message.date_created} user_created={message.user_created} />
                                {isResponseOwner && !messageIsBeingEdited && (
                                    //  Bouton modifier
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5 inline mx-1"
                                        onClick={() => setMessageIsBeingEdited(true)}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                        />
                                    </svg>
                                )}
                                {isResponseOwner && !messageIsBeingEdited && (
                                    // Bouton supprimer
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5 inline mx-1"
                                        onClick={() => setShowPopup(true)}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                    </svg>
                                )}
                                {messageIsBeingEdited && (
                                    <>
                                        {/* Bouton annulé */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                            onClick={() => setMessageIsBeingEdited(false)}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                        {/* Bouton validé */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                            onClick={updateMessage}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.5 12.75l6 6 9-13.5"
                                            />
                                        </svg>
                                    </>
                                )}
                            </div>
                            {!messageIsBeingEdited && (
                                <p
                                    className={'text-1xl whitespace-pre-wrap rounded-2xl px-3 py-1 my-1 max-w-full'}
                                    style={{
                                        backgroundColor: 'rgb(219, 234, 254)',
                                        overflowWrap: 'normal',
                                    }}
                                >
                                    {message.message}
                                </p>
                            )}
                            {messageIsBeingEdited && (
                                <div
                                    className={'rounded-2xl p-4 w-full'}
                                    style={{
                                        backgroundColor: 'rgb(219, 234, 254)',
                                    }}
                                >
                                    <textarea
                                        className={'text-1xl whitespace-pre-wrap w-full p-4'}
                                        defaultValue={message.message}
                                        rows={4}
                                        ref={textAreaRef}
                                        autoFocus={messageIsBeingEdited}
                                        onFocus={e =>
                                            e.currentTarget.setSelectionRange(
                                                e.currentTarget.value.length,
                                                e.currentTarget.value.length,
                                            )
                                        }
                                    ></textarea>
                                </div>
                            )}
                            <DownloadableFile file={file} handleDownloadFile={handleDownloadFile} />
                        </div>
                    </div>
                    {showPopup &&
                        createPortal(
                            <div className={'alertContainer'}>
                                <div className={'alertPopup text-center'}>
                                    <h1>Êtes-vous sur de vouloir supprimer cette réponse ?</h1>
                                    <h3>"{message.message}"</h3>
                                    <div className={'flex justify-evenly'}>
                                        <button
                                            className={
                                                'bg-green-500 hover:bg-green-700 text-white w-1/6 font-bold py-2 px-4 rounded'
                                            }
                                            onClick={deleteMessage}
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
            )}
        </>
    );
}
