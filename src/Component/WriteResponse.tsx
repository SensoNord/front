import React, {FC} from "react";
import forum from "../lib/forum";
import {SubjectType} from "../type/SubjectType";

const WriteResponse: FC<{ postId: string, subject: SubjectType, index: number }> = ({postId, subject, index}) => {
    async function handleSubmit(e: { preventDefault: () => void; target: any; }) {
        e.preventDefault();

        const responseMessage = e.target[0].value.trimEnd();

        const form = new FormData(e.target);
        const file = form.get('file') as File;

        if (file.size === 0 && file.name.length === 0 && responseMessage.length === 0) {
            alert('Vous ne pouvez pas envoyez de message vide');
            return;
        }

        let responseSendMessage = await forum.createResponse(postId, responseMessage);
        console.log(responseSendMessage);

        if (file.size !== 0 || file.name.length !== 0) {
            let response = await forum.uploadFile(form, subject.id, subject.folder_id, responseSendMessage.id, 'Response');
            console.log(response);
        }

        window.location.reload();
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
                    <label htmlFor="file">Fichier</label>
                    <input type="file" name="file" id="file" className={"w-8/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 rounded"}/>
                    <button type="submit" className={"w-8/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>Envoyer</button>
                </span>
            </form>
        </>
    );
}

export default WriteResponse;
