import React, {FC, useEffect, useRef, useState} from "react";
import {MessageResponseType} from "../type/MessageResponseType";
import {emptyDirectusFileType} from "../type/ModifiedFileType";
import folder from "../lib/folder";
import forum from "../lib/forum";
import {createPortal} from "react-dom";
import {UserType} from "../type/UserType";
import {RoleType} from "@directus/sdk";
import LoadingSpinner from "./LoadingSpinner";

const Response: FC<{ response: MessageResponseType, currentUser: UserType | null, currentRole: RoleType | null }> = ({response, currentUser, currentRole}) => {
    const [downloadButton, setDownloadButton] = useState(false);
    const [showFileDeleted, setShowFileDeleted] = useState(false);
    const [file, setFile] = useState(emptyDirectusFileType);

    const [showPopup, setShowPopup] = useState(false);

    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [showEditButton, setShowEditButton] = useState(false);
    const [responseIsBeingEdited, setResponseIsBeingEdited] = useState(false);
    const textAreaRef = useRef(null) as { current: any };

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (currentUser?.id === response.user_created.id) {
                setShowDeleteButton(true);
                setShowEditButton(true);
            } else if (currentRole && currentRole['name'] === 'Administrator') {
                setShowDeleteButton(true);
                setShowEditButton(false);
            } else {
                setShowDeleteButton(false);
                setShowEditButton(false);
            }
            if (response.file_id !== "" && response.file_id !== null && !downloadButton) {
                let files = await folder.getFilesList(response.file_id);
                if (files.data.length !== 0) {
                    setDownloadButton(true);
                    setShowFileDeleted(false);
                    setFile(files.data[0]);
                } else {
                    setShowFileDeleted(true);
                    setDownloadButton(false);
                    setFile(emptyDirectusFileType);
                }
            }
            setIsLoaded(true);
        }, 500);
        return () => clearTimeout(timeout);
    }, [currentRole, currentUser?.id, downloadButton, response.file_id, response.user_created.id]);

    function quitPopup() {
        setShowPopup(false);
    }

    async function deleteResponse() {
        await forum.deleteResponse(response.id);
        window.location.reload();
    }

    function editResponse() {
        setResponseIsBeingEdited(true);
    }

    async function updateMessage() {
        await forum.updateResponse(response.id, textAreaRef.current.value);
        window.location.reload();
    }

    return (
        <>
            {
                !isLoaded ? <LoadingSpinner/> : (
                    <>
                        <div className={"border-black border-2 mt-10 mb-4 px-4 py-2 rounded-lg"}>
                            <div className={"grid grid-cols-12"}>
                                <div className={"col-span-11"}>
                                    {!responseIsBeingEdited && <p className={"text-1xl whitespace-pre-wrap"}>{response.message}</p>}
                                    {responseIsBeingEdited && <div className={"grid grid-cols-12 m-2"}>
                                        <textarea className={"text-1xl whitespace-pre-wrap col-span-11 border border-black"} defaultValue={response.message} rows={4} ref={textAreaRef} autoFocus={responseIsBeingEdited} onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}></textarea>
                                        <div>
                                            <button className={"col-start-12 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2.5 m-1 rounded"} onClick={() => setResponseIsBeingEdited(false)}>Annuler
                                            </button>
                                            <button className={"col-start-11 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2.5 m-1 rounded"} onClick={updateMessage}>Valider
                                            </button>
                                        </div>
                                    </div>
                                    }
                                </div>
                                <div className={"col-span-1"}>
                                    {
                                        showEditButton && !responseIsBeingEdited && (
                                            <button className={"bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-1 w-24 rounded"} onClick={editResponse}>Modifier</button>
                                        )
                                    }
                                    {
                                        showDeleteButton && !responseIsBeingEdited && (
                                            <button className={"bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 w-24 rounded"} onClick={() => setShowPopup(true)}>Supprimer</button>
                                        )
                                    }
                                </div>
                            </div>
                            {downloadButton ? <button onClick={() => folder.downloadFile(file)} className={"underline underline-offset-4"}>Télécharger {file.filename_download}</button> : null}
                            {showFileDeleted ? <p className={"text-red-500"}>Fichier supprimé</p> : null}
                            <div className={"text-right"}>le {(new Date(response.date_created)).toLocaleDateString()} à {(new Date(response.date_created)).toLocaleTimeString()} par {response.user_created.first_name + ' ' + response.user_created.last_name}</div>
                        </div>
                        {
                            showPopup && createPortal(
                                <div className={"alertContainer"}>
                                    <div className={"alertPopup text-center"}>
                                        <h1>Êtes-vous sur de vouloir supprimer cette réponse ?</h1>
                                        <h3>"{response.message}"</h3>
                                        <div className={"flex justify-evenly"}>
                                            <button className={"bg-green-500 hover:bg-green-700 text-white w-1/6 font-bold py-2 px-4 rounded"} onClick={deleteResponse}>Oui</button>
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
}

export default Response;
