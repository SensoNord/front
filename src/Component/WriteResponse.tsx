import React, {FC, useEffect, useRef, useState} from "react";
import forum from "../lib/forum";
import {SubjectType} from "../type/SubjectType";
import folder from "../lib/folder";
import {createPortal} from "react-dom";
import DisplayFiles from "./DisplayFiles";

const WriteResponse: FC<{ postId: string, subject: SubjectType, index: number }> = ({postId, subject, index}) => {
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null) as { current: any };
    const fileRef = useRef(null) as { current: any };
    const [file_name, setFileName] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [file_id, setFileId] = useState<string | null>(null);

    useEffect(() => {
        function handleClickOutside(event: { target: any; }) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popupRef]);

    function quitPopup() {
        setShowPopup(false);
    }

    async function handleSubmit(e: { preventDefault: () => void; target: any; }) {
        e.preventDefault();

        const responseMessage = e.target[0].value.trimEnd();

        if (file?.size === 0 && file.name.length === 0 && responseMessage.length === 0) {
            alert('Vous ne pouvez pas envoyez de message vide');
            return;
        }

        let responseSendMessage = await forum.createResponse(postId, responseMessage, file_id);

        if (file?.size !== 0 || file.name.length !== 0) {
            await folder.uploadFile(file, subject.id, subject.folder_id, responseSendMessage.id, 'Response');
        }

        window.location.reload();
    }

    function getFileFromDrive(file: any) {
        fileRef.current.value = "";
        setFile(null);
        setFileId(file.id);
        setFileName(file.filename_download);
        setShowPopup(false);
    }

    function getFileFromComputer(e: { target: { files: any; }; }) {
        const f = e.target.files[0];
        setFile(f);
        setFileId(null);
        setFileName(f.name);
        setShowPopup(false);
    }

    return (
        <>
            <form onSubmit={handleSubmit} className={"grid grid-cols-12 mt-10"}>
                <span className={"inline col-span-10 flex flex-col"}>
                    <label htmlFor={"response_" + index}>Réponse</label>
                    <textarea id={"response_" + index} className={"w-full p-2 mt-2 border-2 border-gray-700 rounded-md"} rows={3} cols={30}>
                    </textarea>
                </span>
                <span className={"inline col-start-11 col-span-2 flex flex-col justify-end items-end"}>
                    <button type={"button"} className={"w-8/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 rounded"} onClick={() => setShowPopup(true)}>Ajouter un fichier</button>
                    {
                        file_name && (
                            <span>{file_name}</span>
                        )
                    }
                    <button type="submit" className={"w-8/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>Envoyer</button>
                </span>
            </form>
            {
                showPopup && createPortal(
                    <div className={"alertContainer"}>
                        <div className={"alertPopup text-center"} ref={popupRef}>
                            <h1>Drive</h1>
                            <DisplayFiles callback={getFileFromDrive}/>
                            <h1>
                                <input type="file" name="file" id="file" className={"w-8/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 rounded"} ref={fileRef} onChange={getFileFromComputer}/>
                            </h1>
                            <button className={"bg-red-500 hover:bg-red-700 text-white w-1/2 mx-auto font-bold py-2 px-4 rounded"} onClick={quitPopup}>Annuler</button>
                        </div>
                    </div>,
                    document.getElementById('modal-root') as HTMLElement)
            }
        </>
    );
}

export default WriteResponse;
