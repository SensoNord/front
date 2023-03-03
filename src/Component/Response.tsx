import React, {FC, useEffect, useState} from "react";
import {MessageResponseType} from "../type/MessageResponseType";
import {emptyDirectusFileType} from "../type/ModifiedFileType";
import folder from "../lib/folder";

const Response: FC<{ messageResponse: MessageResponseType }> = ({messageResponse}) => {
    const [downloadButton, setDownloadButton] = useState(false);
    const [showFileDeleted, setShowFileDeleted] = useState(false);
    const [file, setFile] = useState(emptyDirectusFileType);

    useEffect(() => {
        if (messageResponse.file_id !== "" && messageResponse.file_id !== null && !downloadButton) {
            folder.getFilesList(messageResponse.file_id).then(files => {
                if (files.data.length === 0) {
                    setShowFileDeleted(true)
                } else {
                    setDownloadButton(true);
                    setFile(files.data[0]);
                }
            });
        }
    });

    return (
        <div>
            <div className={"border-black border-2 mt-10 mb-4 px-4 py-2 rounded-lg"}>
                <p className={"text-1xl whitespace-pre-wrap"}>{messageResponse.message}</p>
                {downloadButton ? <button onClick={() => folder.downloadFile(file)} className={"underline underline-offset-4"}>Télécharger {file.filename_download}</button> : null}
                {showFileDeleted ? <p className={"text-red-500"}>Fichier supprimé</p> : null}
                <div className={"text-right"}>le {(new Date(messageResponse.date_created)).toLocaleDateString()} à {(new Date(messageResponse.date_created)).toLocaleTimeString()} par {messageResponse.user_created.first_name + ' ' + messageResponse.user_created.last_name}</div>
            </div>
        </div>
    );
}

export default Response;
