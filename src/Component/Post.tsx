import React, {FC, useEffect, useState} from "react";
import {PostType} from "../type/PostType";
import {MessageResponseType} from "../type/MessageResponseType";
import Response from "./Response";
import WriteResponse from "./WriteResponse";
import {SubjectType} from "../type/SubjectType";
import forum from "../lib/forum";
import {emptyDirectusFileType} from "../type/DirectusFileType";
import {directusUrl} from "../services/directus";

const Post: FC<{ post: PostType, subject: SubjectType, index: number }> = ({post, subject, index}) => {
    const [downloadButton, setDownloadButton] = useState(false);
    const [showFileDeleted, setShowFileDeleted] = useState(false);
    const [file, setFile] = useState(emptyDirectusFileType);

    useEffect(() => {
        if (post.file_id !== "" && post.file_id !== null && !downloadButton) {
            forum.getFilesList(post.file_id).then(files => {
                if (files.data.length === 0) {
                    setShowFileDeleted(true)
                } else {
                    forum.getFile(post.file_id).then(f => {
                        if (f) {
                            setDownloadButton(true);
                            setFile(f);
                        }
                    });
                }
            });
        }
    });

    function download() {
        fetch(directusUrl + 'assets/' + post.file_id + '?download', {
            method: 'GET',
            headers: {
                'Content-Type': file.type,
                'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
            },
        })
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(
                    new Blob([blob]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    file.filename_download,
                );
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
            });
    }

    return (
        <div className={"w-full my-16"}>
            <div className={"border-black border-2 mx-10 px-4 py-2 rounded-lg"}>
                <h2 className={"text-2xl font-bold"}>{post.title}</h2>
                <p className={"text-1xl whitespace-pre-wrap"}>{post.message}</p>
                {downloadButton ? <button onClick={download} className={"underline underline-offset-4"}>Télécharger {file.filename_download}</button> : null}
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
                                return <Response messageResponse={response} key={index}/>
                            }
                        )
                    }
                    <WriteResponse postId={post.id} subject={subject} index={index}/>
                </div>
            </div>
        </div>
    );
}

export default Post;
