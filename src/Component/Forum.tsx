import React, {useEffect, useState} from "react";
import forum from "../lib/forum";
import {directus} from "../services/directus";
import {emptySubject} from "../type/SubjectType";
import {PostType} from "../type/PostType";
import Post from "./Post";

export default function Forum() {
    const [subject, setSubject] = useState(emptySubject);

    useEffect(() => {
        directus.auth
            .login({email: "first.user@example.com", password: "password"})
            .then(() => {
                forum.getSubjects("28730aa8-275a-4b16-9ff2-1494f5342243").then((subject) => {
                    if (subject) {
                        setSubject(subject);
                    }
                });
            })
            .catch(() => {
                window.alert('Invalid credentials');
            });
    }, []);

    return (
        <div>
            {
                subject && (
                    <div>
                        <h1 className="mx-10 my-10 pb-10 text-4xl font-bold underline">{subject['name']}</h1>
                        <div>
                            {
                                subject['posts'].map((post: PostType, index: any) => {
                                        return (
                                            <Post post={post} key={index}></Post>
                                        )
                                    }
                                )
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}
