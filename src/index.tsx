import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Forum from "./feature/Chat/Forum";
import Drive from "./feature/Drive";
import folder from "./lib/folder";
import forum from "./lib/forum";
import {PostType} from "./types/Chat/PostType";
import {directus} from "./libraries/directus";
import {UserType} from "./types/Chat/UserType";
import {RoleType} from "@directus/sdk";
import conversation from "./lib/conversation";
import Conversation from "./components/Conversation/Conversation";
import {Provider} from 'react-redux';
import {store} from "./App/store";

const subject_id = "28730aa8-275a-4b16-9ff2-1494f5342243";
// const subject_id = "d7aa3244-4a37-4999-a716-9a0100eb20cc";
const conversation_id = "a881843f-211f-4d2f-bc47-46e0b2b094fe";
const page: string = "forum";
// const page: string = "drive";
// const page: string = "conversation";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

// forum.connection()
//     .then(async () => {
//         if (page === 'forum') {
//             root.render(
//                 <React.StrictMode>
//                     <Provider store={store}>
//                         <Forum/>
//                     </Provider>
//                 </React.StrictMode>
//             );
//         } else if (page === 'drive') {
//             root.render(
//                 <React.StrictMode>
//                     <Drive/>
//                 </React.StrictMode>
//             );
//         } else if (page === 'conversation') {
//             const conv = await conversation.getConversation(conversation_id);
//             if (conv) {
//                 root.render(
//                     <React.StrictMode>
//                         <div style={{height: '800px', width: '80%'}} className={"mx-auto my-32 border-2 border-black"}>
//                             <Conversation conv={conv}/>
//                         </div>
//                     </React.StrictMode>
//                 );
//             } else {
//                 window.alert('Invalid conversation');
//             }
//         }
//     })
//     .catch(() => {
//         window.alert('Invalid credentials');
//     });
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
