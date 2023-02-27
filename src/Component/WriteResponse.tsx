import React, {FC} from "react";
import {MessageResponseType} from "../type/MessageResponseType";
import forum from "../lib/forum";

const WriteResponse: FC<{ postId: string, index: number }> = ({postId, index}) => {
    function handleSubmit(e: { preventDefault: () => void; target: any; }) {
        e.preventDefault();

        const responseMessage = e.target[0].value;
        forum.createResponse(postId, responseMessage).then((response: MessageResponseType) => {
            console.log(response);
        });
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
                    <button type="submit" className={"w-8/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>Envoyer</button>
                </span>
            </form>
        </>
    );
}

export default WriteResponse;
