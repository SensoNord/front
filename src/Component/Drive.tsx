import React, {useRef, useState} from "react";
import DisplayFiles from "./DisplayFiles";
import {createPortal} from "react-dom";
import {directus} from "../services/directus";
import "../styles/Forum.css";
import folder from "../lib/folder";


export default function Drive() {
    const [showPopup, setShowPopup] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [folderId, setFolderId] = useState<string>('');
    const [uploadIsEnabled, setUploadIsEnabled] = useState<boolean>(false);

    const fileRef = useRef(null) as { current: any };

    function newFile() {
        setShowPopup(true);
    }

    if (folderId !== '') {
        directus.items('subjects').readByQuery({
            filter: {
                "folder_id": {"_eq": folderId}
            },
            fields: ['id']
        }).then((res) => {
            if (res.data && res.data.length !== 0) {
                setUploadIsEnabled(true);
            } else {
                setUploadIsEnabled(false);
            }
        });
    }

    async function handleAddNewFile(e: { preventDefault: () => void; target: any; }) {
        e.preventDefault();

        const responseMessage = e.target[0].value.trimEnd();

        if (file?.size === 0 && file.name.length === 0 && responseMessage.length === 0) {
            alert('Vous ne pouvez pas envoyez de message vide');
            return;
        }

        if (file?.size !== 0 || file.name.length !== 0) {
            let subject = (await directus.items('subjects').readByQuery({
                filter: {
                    "folder_id": {"_eq": folderId}
                },
                fields: ['id']
            }) as any).data[0];
            await folder.uploadFile(file, folderId, subject.id);
        }

        setShowPopup(false);
        window.location.reload();
    }

    function getFileFromComputer(e: { target: { files: any; }; }) {
        const f = e.target.files[0];
        setFile(f);
    }

    return (
        <>
            <div>
                <button className={`bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded${!uploadIsEnabled ? ' cursor-not-allowed' : ''}`} disabled={!uploadIsEnabled} onClick={newFile}>Ajouter un fichier</button>
                <DisplayFiles setFolderId={setFolderId} showDelete={true} callbackOnClick={folder.downloadFile}></DisplayFiles>
            </div>
            {
                showPopup && createPortal(
                    <div className={"alertContainer"}>
                        <div className={"alertPopup text-center"}>
                            <h1>Ajout d'un fichier</h1>
                            <form id="upload-file" className={"grid grid-cols-12 m-2"} onSubmit={handleAddNewFile}>
                                <label className={"col-span-12 m-2 p-2"}>Fichier<input type={"file"} name={"file"} id={"file"} className={"mx-2"} ref={fileRef} onChange={getFileFromComputer}/></label>
                                <button className={"col-span-6 w-8/12 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mb-2 mx-auto rounded"} onClick={() => setShowPopup(false)}>Annuler</button>
                                <button className={"col-span-6 w-8/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 mx-auto rounded"} type={"submit"}>Envoyer</button>
                            </form>
                        </div>
                    </div>,
                    document.getElementById('modal-root') as HTMLElement)
            }
        </>
    )
}
