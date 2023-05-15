import React, {FC, useEffect, useRef, useState} from "react";
import {PostType} from "../type/PostType";
import {MessageResponseType} from "../type/MessageResponseType";
import Response from "./Response";
import WriteResponse from "./WriteResponse";
import {SubjectType} from "../type/SubjectType";
import {emptyDirectusFileType} from "../type/ModifiedFileType";
import folder from "../lib/folder";
import forum from "../lib/forum";
import {RoleType} from "@directus/sdk";
import {UserType} from "../type/UserType";
import {createPortal} from "react-dom";
import LoadingSpinner from "./LoadingSpinner";

const Post: FC<{ post: PostType, subject: SubjectType, index: number, currentUser: UserType | null, currentRole: RoleType | null }> = ({post, subject, index, currentUser, currentRole}) => {
    const [showPopup, setShowPopup] = useState(false);

    const [downloadButton, setDownloadButton] = useState(false);
    const [showFileDeleted, setShowFileDeleted] = useState(false);
    const [file, setFile] = useState(emptyDirectusFileType);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [showEditButton, setShowEditButton] = useState(false);
    const [postIsBeingEdited, setPostIsBeingEdited] = useState(false);
    const textAreaRef = useRef(null) as { current: any };

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (currentUser?.id === post.user_created.id) {
                setShowDeleteButton(true);
                setShowEditButton(true);
            } else if (currentRole && currentRole['name'] === 'Administrator') {
                setShowDeleteButton(true);
                setShowEditButton(false);
            } else {
                setShowDeleteButton(false);
                setShowEditButton(false);
            }
            if (post.file_id !== "" && post.file_id !== null && !downloadButton) {
                let files = await folder.getFilesList(post.file_id);
                if (files.data.length !== 0) {
                    setDownloadButton(true);
                    setShowFileDeleted(false);
                    setFile(files.data[0]);
                } else {
                    setShowFileDeleted(true);
                    setDownloadButton(false);
                    setFile(emptyDirectusFileType);
                }
                setIsLoaded(true);
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [currentRole, currentUser?.id, downloadButton, post.file_id, post.user_created.id]);

    function quitPopup() {
        setShowPopup(false);
    }

    async function deletePost() {
        await forum.deletePost(post.id);
        window.location.reload();
    }

    function editPost() {
        setPostIsBeingEdited(true);
        textAreaRef.current?.focus();
    }

    async function updatePost() {
        await forum.updatePost(post.id, textAreaRef.current.value);
        window.location.reload();
    }

    return (
        <>
            {
                !isLoaded ? <LoadingSpinner/> : (
                    <>
                        <div className={"w-full my-16"}>
                            <div className={"border-black border-2 mx-10 px-4 py-2 rounded-lg"}>
                                <div className={"grid grid-cols-12"}>
                                    <h2 className={"text-2xl font-bold col-span-10"}>{post.title}</h2>
                                    {
                                        showEditButton && !postIsBeingEdited && (
                                            <button className={"col-start-11 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-1 w-24 rounded"} onClick={editPost}>Modifier</button>
                                        )
                                    }
                                    {
                                        showDeleteButton && !postIsBeingEdited && (
                                            <button className={"col-start-12 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 w-24 rounded"} onClick={() => setShowPopup(true)}>Supprimer</button>
                                        )
                                    }
                                </div>
                                {!postIsBeingEdited && <p className={"text-1xl whitespace-pre-wrap"}>{post.message}</p>}
                                {postIsBeingEdited && <div className={"grid grid-cols-12 m-2"}>
                                    <textarea className={"text-1xl whitespace-pre-wrap col-span-11 border border-black"} defaultValue={post.message} rows={4} ref={textAreaRef} autoFocus={postIsBeingEdited} onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}></textarea>
                                    <div>
                                        <button className={"col-start-12 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2.5 m-1 rounded"} onClick={() => setPostIsBeingEdited(false)}>Annuler
                                        </button>
                                        <button className={"col-start-11 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2.5 m-1 rounded"} onClick={updatePost}>Valider
                                        </button>
                                    </div>
                                </div>
                                }
                                {downloadButton ? <button onClick={() => folder.downloadFile(file)} className={"underline underline-offset-4"}>Télécharger {file.filename_download}</button> : null}
                                {showFileDeleted ? <p className={"text-red-500"}>Fichier supprimé</p> : null}
                                <div className={"text-right"}>le {(new Date(post.date_created)).toLocaleDateString()} à {(new Date(post.date_created)).toLocaleTimeString()} par {post.user_created.first_name + ' ' + post.user_created.last_name}</div>
                            </div>
                            <div className={"mx-10 flex flex-row justify-end"}>
                                <div className={"w-4/5"}>
                                    {
                                        post['responses'].sort((a: MessageResponseType, b: MessageResponseType) => {
                                                return new Date(a.date_created).getTime() - new Date(b.date_created).getTime();
                                            }
                                        ).map((response: MessageResponseType, index: number) => {
                                                return <Response response={response} key={index} currentUser={currentUser} currentRole={currentRole}/>
                                            }
                                        )
                                    }
                                    <WriteResponse postId={post.id} subject={subject} index={index}/>
                                </div>
                            </div>
                        </div>
                        {
                            showPopup && createPortal(
                                <div className={"alertContainer"}>
                                    <div className={"alertPopup text-center"}>
                                        <h1>Êtes-vous sur de vouloir supprimer ce post ?</h1>
                                        <h3>"{post.title}"</h3>
                                        <div className={"flex justify-evenly"}>
                                            <button className={"bg-green-500 hover:bg-green-700 text-white w-1/6 font-bold py-2 px-4 rounded"} onClick={deletePost}>Oui</button>
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

export default Post;
