import React, {FC} from "react";
import {PostType} from "../type/PostType";
import {MessageResponseType} from "../type/MessageResponseType";
import Response from "./Response";
import WriteResponse from "./WriteResponse";

const Post: FC<{ post: PostType, index: number }> = ({post, index}) => {
    return (
        <div className={"w-full my-16"}>
            <div className={"border-black border-2 mx-10 px-4 py-2 rounded-lg"}>
                <h2 className={"text-2xl font-bold"}>{post.title}</h2>
                <p className={"text-1xl whitespace-pre-wrap"}>{post.message}</p>
                <div className={"text-right"}>le {(new Date(post.date_created)).toLocaleDateString()} à {(new Date(post.date_created)).toLocaleTimeString()} par {post.user_created.first_name + ' ' + post.user_created.last_name}</div>
            </div>
            <div className={"mx-10 flex flex-row justify-end"}>
                <div className={"w-4/5"}>
                    {
                        post['responses'].sort((a: MessageResponseType, b: MessageResponseType) => {
                                return new Date(a.date_created).getTime() - new Date(b.date_created).getTime();
                            }
                        ).map((response: MessageResponseType, index: number) => {
                                return <Response messageResponse={response} key={index}/>
                            }
                        )
                    }
                    <WriteResponse postId={post.id} index={index}/>
                </div>
            </div>
        </div>
    );
}

export default Post;
