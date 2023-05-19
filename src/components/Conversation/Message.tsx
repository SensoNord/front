import React, {FC, useEffect, useRef, useState} from "react";
import {MessageResponseType} from "../../types/Chat/MessageResponseType";
import {emptyDirectusFileType} from "../../types/Chat/ModifiedFileType";
import folder from "../../lib/folder";
import LoadingSpinner from "../LoadingSpinner";
import {createPortal} from "react-dom";
import {UserType} from "../../types/Chat/UserType";
import conversation from "../../lib/conversation";
import NameAndDate from "../Field/NameAndDate";

const Message: FC<{ message: MessageResponseType, currentUser: UserType | null, align: string }> = ({message, currentUser, align}) => {
    const [downloadButton, setDownloadButton] = useState(false);
    const [showFileDeleted, setShowFileDeleted] = useState(false);
    const [file, setFile] = useState(emptyDirectusFileType);

    const [showPopup, setShowPopup] = useState(false);

    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [showEditButton, setShowEditButton] = useState(false);
    const [messageIsBeingEdited, setMessageIsBeingEdited] = useState(false);
    const textAreaRef = useRef(null) as { current: any };

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (currentUser?.id === message.user_created.id) {
                setShowDeleteButton(true);
                setShowEditButton(true);
            } else {
                setShowDeleteButton(false);
                setShowEditButton(false);
            }
            if (message.file_id !== "" && message.file_id !== null && !downloadButton) {
                let files = await folder.getFilesList(message.file_id);
                if (files.data.length !== 0) {
                    setDownloadButton(true);
                    setShowFileDeleted(false);
                    setFile(files.data[0]);
                } else {
                    console.log("file deleted");
                    setDownloadButton(false);
                    setShowFileDeleted(true);
                    setFile(emptyDirectusFileType);
                }
            }
            setIsLoaded(true);
        }, 500);
        return () => clearTimeout(timeout);
    }, [currentUser?.id, downloadButton, message.file_id, message.user_created.id]);

    function quitPopup() {
        setShowPopup(false);
    }

    async function deleteMessage() {
        await conversation.deleteMessage(message.id);
        window.location.reload();
    }

    async function updateMessage() {
        await conversation.updateMessage(message.id, textAreaRef.current.value);
        window.location.reload();
    }

    return (
        <>
            {
                !isLoaded ? '' : (
                    <>
                        <div className={"m-4"}>
                            <div className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'}`}>
                                <div className={'flex'}>
                                    <NameAndDate date_created={message.date_created} user_created={message.user_created}/>
                                    {
                                        showEditButton && !messageIsBeingEdited && (
                                            //  Bouton modifier
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline mx-1" onClick={() => setMessageIsBeingEdited(true)}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/>
                                            </svg>
                                        )
                                    }
                                    {
                                        showDeleteButton && !messageIsBeingEdited && (
                                            // Bouton supprimer
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline mx-1" onClick={() => setShowPopup(true)}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                            </svg>
                                        )
                                    }
                                    {
                                        messageIsBeingEdited && (
                                            <>
                                                {/* Bouton annulé */}
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={() => setMessageIsBeingEdited(false)}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                {/* Bouton validé */}
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={updateMessage}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            </>
                                        )
                                    }
                                </div>
                                {!messageIsBeingEdited && <p className={"text-1xl whitespace-pre-wrap rounded-2xl px-3 py-1 my-1 max-w-full"} style={{backgroundColor: 'rgb(219, 234, 254)', overflowWrap: 'normal'}}>{message.message}</p>}
                                {messageIsBeingEdited && <div className={"rounded-2xl p-4 w-full"} style={{backgroundColor: 'rgb(219, 234, 254)'}}>
                                    <textarea className={"text-1xl whitespace-pre-wrap w-full p-4"} defaultValue={message.message} rows={4} ref={textAreaRef} autoFocus={messageIsBeingEdited} onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}></textarea>
                                </div>
                                }

                                {downloadButton ? <button onClick={() => folder.downloadFile(file)} className={"underline underline-offset-4"}>Télécharger {file.filename_download}</button> : null}
                                {showFileDeleted ? <p className={"text-red-500"}>Fichier supprimé</p> : null}
                            </div>
                            {/*<div className={"grid grid-cols-12"}>*/}
                            {/*    <div className={"col-span-11"}>*/}
                            {/*        {!messageIsBeingEdited && <p className={"text-1xl whitespace-pre-wrap"}>{message.message}</p>}*/}
                            {/*        {messageIsBeingEdited && <div className={"grid grid-cols-12 m-2"}>*/}
                            {/*            <textarea className={"text-1xl whitespace-pre-wrap col-span-11 border border-black"} defaultValue={message.message} rows={4} ref={textAreaRef} autoFocus={messageIsBeingEdited} onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}></textarea>*/}
                            {/*            <div>*/}
                            {/*                <button className={"col-start-12 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2.5 m-1 rounded"} onClick={() => setMessageIsBeingEdited(false)}>Annuler*/}
                            {/*                </button>*/}
                            {/*                <button className={"col-start-11 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2.5 m-1 rounded"} onClick={updateMessage}>Valider*/}
                            {/*                </button>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*        }*/}
                            {/*    </div>*/}
                            {/*    <div className={"col-span-1"}>*/}
                            {/*        {*/}
                            {/*            showEditButton && !messageIsBeingEdited && (*/}
                            {/*                <button className={"bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-1 w-24 rounded"} onClick={editResponse}>Modifier</button>*/}
                            {/*            )*/}
                            {/*        }*/}
                            {/*        {*/}
                            {/*            showDeleteButton && !messageIsBeingEdited && (*/}
                            {/*                <button className={"bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 w-24 rounded"} onClick={() => setShowPopup(true)}>Supprimer</button>*/}
                            {/*            )*/}
                            {/*        }*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                        {
                            showPopup && createPortal(
                                <div className={"alertContainer"}>
                                    <div className={"alertPopup text-center"}>
                                        <h1>Êtes-vous sur de vouloir supprimer cette réponse ?</h1>
                                        <h3>"{message.message}"</h3>
                                        <div className={"flex justify-evenly"}>
                                            <button className={"bg-green-500 hover:bg-green-700 text-white w-1/6 font-bold py-2 px-4 rounded"} onClick={deleteMessage}>Oui</button>
                                            <button className={"bg-red-500 hover:bg-red-700 text-white w-1/6 font-bold py-2 px-4 rounded"} onClick={quitPopup}>Annuler</button>
                                        </div>
                                    </div>
                                </div>,
                                document.getElementById('modal-root') as HTMLElement)
                        }
                    </>
                )
            }
        </>
    );

    return (
        <div>
            <p>{message.message}</p>
            <p>le {(new Date(message.date_created)).toLocaleDateString()} à {(new Date(message.date_created)).toLocaleTimeString()} par {message.user_created.first_name + ' ' + message.user_created.last_name}</p>
        </div>
    )
}

export default Message;