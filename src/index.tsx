import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const subject_id = "28730aa8-275a-4b16-9ff2-1494f5342243";
// const subject_id = "d7aa3244-4a37-4999-a716-9a0100eb20cc";
const page: string = "forum";
// const page: string = "drive";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// forum.connection()
//     .then(async () => {
//         if (page === 'forum') {
//             const subject = await forum.getSubjects(subject_id);
//             if (subject) {
//                 root.render(
//                     <React.StrictMode>
//                         <Forum subject={subject}/>
//                     </React.StrictMode>
//                 );
//             } else {
//                 window.alert('Invalid subject');
//             }
//         } else if (page === 'drive') {
//             root.render(
//                 <React.StrictMode>
//                     <Drive/>
//                 </React.StrictMode>
//             );
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
