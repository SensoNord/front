import React, {useEffect, useRef, useState} from "react";
import forum from "../lib/forum";
import {emptySubject} from "../type/SubjectType";
import {PostType} from "../type/PostType";
import Post from "./Post";
import "../styles/Forum.css";
import {createPortal} from "react-dom";
import folder from "../lib/folder";
import DisplayFiles from "./DisplayFiles";

export default function Forum() {
    const [subject, setSubject] = useState(emptySubject);
    const subject_id = "28730aa8-275a-4b16-9ff2-1494f5342243";
    const [showPopup, setShowPopup] = useState(false);
    const [showPopup2, setShowPopup2] = useState(false);
    const popupRef = useRef(null) as { current: any };
    const popupRef2 = useRef(null) as { current: any };
    const fileRef = useRef(null) as { current: any };
    const [file_name, setFileName] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [file_id, setFileId] = useState<string | null>(null);

    function quitPopup() {
        setShowPopup(false);
    }

    function quitPopup2() {
        setShowPopup2(false);
    }


    useEffect(() => {
        forum.connection()
            .then(() => {
                forum.getSubjects(subject_id).then((subject) => {
                    if (subject) {
                        subject.posts.sort((a: PostType, b: PostType) => {
                            return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
                        });
                        setSubject(subject);
                    }
                });
            })
            .catch(() => {
                window.alert('Invalid credentials');
            });
    }, []);

    function createPostButton() {
        setShowPopup(true);
    }

    async function handleSubmit(e: { preventDefault: () => void; target: any; }) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const formJson = Object.fromEntries(formData.entries()) as { titlePost: string, message: string };
        if (formJson.titlePost && formJson.message) {
            const post = await forum.createPost(subject_id, formJson.titlePost, formJson.message, file_id);
            setShowPopup(false);
            if (file?.size !== 0 || file.name.length !== 0) {
                await folder.uploadFile(file, subject.id, subject.folder_id, post.id, 'Post');
            }
            window.location.reload();
        } else {
            document.getElementById("errorMessage")?.classList.remove("hidden");
        }
    }

    function getFileFromDrive(file: any) {
        fileRef.current.value = "";
        setFile(null);
        setFileId(file.id);
        setFileName(file.filename_download);
        setShowPopup2(false);
    }

    function getFileFromComputer(e: { target: { files: any; }; }) {
        const f = e.target.files[0];
        setFile(f);
        setFileId(null);
        setFileName(f.name);
        setShowPopup2(false);
    }

    return (
        <>
            {
                subject && (
                    <div>
                        <div className={"grid grid-cols-12"}>
                            <h1 className="col-span-6 mx-10 my-10 pb-10 text-4xl font-bold underline">{subject['name']}</h1>
                            <div className={"col-end-13 col-span-3 flex flex-col justify-center items-center"}>
                                <button onClick={createPostButton} className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>Nouveau post</button>
                            </div>
                        </div>
                        <div>
                            {
                                subject['posts'].map((post: PostType, index: number) => {
                                        return (
                                            <Post post={post} key={index} subject={subject} index={index}></Post>
                                        )
                                    }
                                )
                            }
                        </div>
                    </div>
                )
            }
            {
                showPopup && createPortal(
                    <div className={"alertContainer"}>
                        <form className={"alertPopup text-center"} onSubmit={handleSubmit} ref={popupRef}>
                            <div className={"p-2 text-xl"}>
                                <div className="grid grid-cols-1 mb-10">
                                    <label htmlFor="titlePost">Titre</label>
                                    <input type="text" id="titlePost" name="titlePost" className={"mt-2 border-2 border-gray-700 rounded-md"}/>
                                </div>
                                <div className="grid grid-cols-1">
                                    <label htmlFor="message">Message</label>
                                    <textarea id="message" name="message" className={"mt-2 border-2 border-gray-700 rounded-md"}/>
                                </div>
                                <div className="grid grid-cols-1">
                                    <label htmlFor="file">Fichier</label>
                                    <button type={"button"} className={"w-8/12 bg-blue-500 hover:bg-blue-700 text-white mx-auto font-bold py-2 px-4 mb-2 rounded"} onClick={() => setShowPopup2(true)}>Ajouter un fichier</button>
                                    {
                                        file_name && (
                                            <span>{file_name}</span>
                                        )
                                    }
                                </div>
                            </div>
                            <div id={"errorMessage"} className={"text-red-600 font-bold text-2xl hidden"}>Veuillez remplir les champs "Titre" et "Message"1</div>
                            <div className="flex flex-row justify-evenly text-white mt-5">
                                <button className={"bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"} onClick={quitPopup}>Annuler</button>
                                <button className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"} type={"submit"}>Envoyer</button>
                            </div>
                        </form>
                    </div>,
                    document.getElementById('modal-root') as HTMLElement)
            }
            {
                showPopup2 && createPortal(
                    <div className={"alertContainer"}>
                        <div className={"alertPopup text-center"} ref={popupRef2}>
                            <h1>Drive</h1>
                            <DisplayFiles callback={getFileFromDrive}/>
                            <h1>
                                <input type="file" name="file" id="file" className={"w-8/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 rounded"} ref={fileRef} onChange={getFileFromComputer}/>
                            </h1>
                            <button className={"bg-red-500 hover:bg-red-700 text-white w-1/2 mx-auto font-bold py-2 px-4 rounded"} onClick={quitPopup2}>Annuler</button>
                        </div>
                    </div>,
                    document.getElementById('modal-root') as HTMLElement)
            }
        </>
    )
}
