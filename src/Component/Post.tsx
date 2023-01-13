import React, {FC} from "react";
import {PostType} from "../type/PostType";
import {MessageResponseType} from "../type/MessageResponseType";
import Response from "./Response";

const Post: FC<{ post: PostType }> = ({post}) => {
    return (
        <div className={"w-7/12 my-16"}>
            <div className={"border-black border-2 mx-10 px-4 py-2 rounded-lg"}>
                <h2 className={"text-2xl font-bold"}>{post.title}</h2>
                <p className={"text-1xl whitespace-pre-wrap"}>{post.message}</p>
                <div className={"text-right"}>le {(new Date(post.date_created)).toLocaleDateString()} à {(new Date(post.date_created)).toLocaleTimeString()} par {post.user_created.first_name + ' ' + post.user_created.last_name}</div>
            </div>
            <div className={"mx-10 flex flex-row justify-end"}>
                <div className={"w-4/5"}>
                    {
                        post['responses'].map((response: MessageResponseType, index: any) => {
                                return (
                                    <Response messageResponse={response} key={index}></Response>
                                )
                            }
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default Post;
