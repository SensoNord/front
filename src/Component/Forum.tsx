import React, {useEffect, useRef, useState} from "react";
import forum from "../lib/forum";
import {directus} from "../services/directus";
import {emptySubject} from "../type/SubjectType";
import {PostType} from "../type/PostType";
import Post from "./Post";
import "./Forum.css";
import {createPortal} from "react-dom";

export default function Forum() {
    const [subject, setSubject] = useState(emptySubject);
    const subject_id = "28730aa8-275a-4b16-9ff2-1494f5342243";
    const [showPopup, setShowPopup] = useState(false);
    const ref = useRef(null) as { current: any };

    useEffect(() => {
        function handleClickOutside(event: { target: any; }) {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowPopup(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);


    useEffect(() => {
        directus.auth
            .login({email: "first.user@example.com", password: "password"})
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

        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries()) as { title: string, message: string };
        if (formJson.title && formJson.message) {
            forum.createPost(subject_id, formJson.title, formJson.message).then((result: any) => {
                    setShowPopup(false);
                }
            );
        } else {
            document.getElementById("errorMessage")?.classList.remove("hidden");
        }
    }

    function quitPopup() {
        setShowPopup(false);
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
                                            <Post post={post} key={index} index={index}></Post>
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
                        <form className={"alertPopup text-center"} onSubmit={handleSubmit} ref={ref}>
                            <div className={"p-2 text-xl"}>
                                <div className="grid grid-cols-1 mb-10">
                                    <label htmlFor="title">Titre</label>
                                    <input type="text" id="title" name="title" className={"mt-2 border-2 border-gray-700 rounded-md"}/>
                                </div>
                                <div className="grid grid-cols-1">
                                    <label htmlFor="message">Message</label>
                                    <textarea id="message" name="message" className={"mt-2 border-2 border-gray-700 rounded-md"}/>
                                </div>
                            </div>
                            <div id={"errorMessage"} className={"text-red-600 font-bold text-2xl hidden"}>Veuillez remplir tous les champs</div>
                            <div className="flex flex-row justify-evenly text-white mt-5">
                                <button className={"bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"} onClick={quitPopup}>Annuler</button>
                                <button className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"} type={"submit"}>Envoyer</button>
                            </div>
                        </form>
                    </div>,
                    document.getElementById('modal-root') as HTMLElement)
            }
        </>
    )
}
