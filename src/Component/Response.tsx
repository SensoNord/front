import React, {FC} from "react";
import {MessageResponseType} from "../type/MessageResponseType";

const Response: FC<{ messageResponse: MessageResponseType }> = ({messageResponse}) => {
    return (
        <div>
            <div className={"border-black border-2 mt-10 mb-4 px-4 py-2 rounded-lg"}>
                <p className={"text-1xl whitespace-pre-wrap"}>{messageResponse.message}</p>
                <div className={"text-right"}>le {(new Date(messageResponse.date_created)).toLocaleDateString()} à {(new Date(messageResponse.date_created)).toLocaleTimeString()} par {messageResponse.user_created.first_name + ' ' + messageResponse.user_created.last_name}</div>
            </div>
        </div>
    );
}

export default Response;
