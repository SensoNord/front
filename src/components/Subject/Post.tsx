import { useEffect, useRef, useState } from 'react';
import { PostType } from '../../types/Chat/PostType';
import { MessageResponseType } from '../../types/Chat/MessageResponseType';
import Response from './Response';
import WriteResponse from './WriteResponse';
import { SubjectType } from '../../types/Chat/SubjectType';
import {
    ModifiedFileType,
    emptyDirectusFileType,
} from '../../types/Chat/ModifiedFileType';
import { createPortal } from 'react-dom';
import LoadingSpinner from '../LoadingSpinner';
import { useAppDispatch } from '../../App/hooks';
import {
    deletePostById,
    setCurrentSubjectDisplayWithAllRelatedData,
    updatePostMessageById,
} from '../../slicers/subject-slice';
import { downloadFile, fetchFileById } from '../../slicers/file-slice';
import { ErrorType, isErrorType } from '../../types/Request/ErrorType';
import { PayLoadUpdatePost } from '../../slicers/subject-slice-helper';

type Props = {
    post: PostType;
    subject: SubjectType;
    index: number;
};

export default function Post(props: Props) {
    const { post, subject, index } = props;
    const dispatch = useAppDispatch();

    const [showPopup, setShowPopup] = useState(false);

    const [downloadButton, setDownloadButton] = useState(false);
    const [showFileDeleted, setShowFileDeleted] = useState(false);
    const [file, setFile] = useState(emptyDirectusFileType);
    const [postIsBeingEdited, setPostIsBeingEdited] = useState(false);
    const textAreaRef = useRef(null) as { current: any };
    const [isLoaded, setIsLoaded] = useState(true);
    const [isAdministrator, setIsAdministrator] = useState(
        null as boolean | null,
    );
    const [isPostOwner, setIsPostOwner] = useState(null as boolean | null);
    const [connectedUserId, setConnectedUserId] = useState('');
    const [connectedUserRoleName, setConnectedUserRoleName] = useState('');

    useEffect(() => {
        setConnectedUserId(localStorage.getItem('connectedUserId') as string);
        setConnectedUserRoleName(
            localStorage.getItem('connectedUserRoleName') as string,
        );
        setIsAdministrator(connectedUserRoleName === 'Administrator');
        setIsPostOwner(connectedUserId === post.user_created.id);
    }, [connectedUserId, connectedUserRoleName, post.user_created.id]);

    useEffect(() => {
        async function fetchFile() {
            if (
                post.file_id !== '' &&
                post.file_id !== null &&
                post.file_id !== undefined
            ) {
                let filesPayload = await dispatch(fetchFileById(post.file_id));
                let files = filesPayload.payload as
                    | ModifiedFileType
                    | ErrorType;
                if (!isErrorType(files)) {
                    setDownloadButton(true);
                    setShowFileDeleted(false);
                    setFile(files);
                } else {
                    setShowFileDeleted(true);
                    setDownloadButton(false);
                    setFile(emptyDirectusFileType);
                }
                setIsLoaded(true);
            }
        }
        fetchFile();
    }, [dispatch, post.file_id]);

    function quitPopup() {
        setShowPopup(false);
    }

    async function deletePost() {
        await dispatch(deletePostById(post.id));
        dispatch(setCurrentSubjectDisplayWithAllRelatedData(subject.id));
        quitPopup();
    }

    function editPost() {
        setPostIsBeingEdited(true);
        textAreaRef.current?.focus();
    }

    async function updatePost() {
        await dispatch(
            updatePostMessageById({
                id: post.id,
                message: textAreaRef.current.value,
            } as PayLoadUpdatePost),
        );
        dispatch(setCurrentSubjectDisplayWithAllRelatedData(subject.id));
        setPostIsBeingEdited(false);
    }

    async function handleDownloadFile() {
        await dispatch(downloadFile(file as ModifiedFileType));
    }

    return (
        <>
            {!isLoaded ? (
                <LoadingSpinner />
            ) : (
                <>
                    <div className={'w-full my-16'}>
                        <div
                            className={
                                'border-black border-2 mx-10 px-4 py-2 rounded-lg'
                            }
                        >
                            <div className={'grid grid-cols-12'}>
                                <h2
                                    className={'text-2xl font-bold col-span-10'}
                                >
                                    {post.title}
                                </h2>
                                {isPostOwner && !postIsBeingEdited && (
                                    <button
                                        className={
                                            'col-start-11 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-1 w-24 rounded'
                                        }
                                        onClick={editPost}
                                    >
                                        Modifier
                                    </button>
                                )}
                                {(isPostOwner || isAdministrator) &&
                                    !postIsBeingEdited && (
                                        <button
                                            className={
                                                'col-start-12 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 w-24 rounded'
                                            }
                                            onClick={() => setShowPopup(true)}
                                        >
                                            Supprimer
                                        </button>
                                    )}
                            </div>
                            {!postIsBeingEdited && (
                                <p className={'text-1xl whitespace-pre-wrap'}>
                                    {post.message}
                                </p>
                            )}
                            {postIsBeingEdited && (
                                <div className={'grid grid-cols-12 m-2'}>
                                    <textarea
                                        className={
                                            'text-1xl whitespace-pre-wrap col-span-11 border border-black'
                                        }
                                        defaultValue={post.message}
                                        rows={4}
                                        ref={textAreaRef}
                                        autoFocus={postIsBeingEdited}
                                        onFocus={e =>
                                            e.currentTarget.setSelectionRange(
                                                e.currentTarget.value.length,
                                                e.currentTarget.value.length,
                                            )
                                        }
                                    ></textarea>
                                    <div>
                                        <button
                                            className={
                                                'col-start-12 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2.5 m-1 rounded'
                                            }
                                            onClick={() =>
                                                setPostIsBeingEdited(false)
                                            }
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            className={
                                                'col-start-11 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2.5 m-1 rounded'
                                            }
                                            onClick={updatePost}
                                        >
                                            Valider
                                        </button>
                                    </div>
                                </div>
                            )}
                            {downloadButton ? (
                                <button
                                    onClick={handleDownloadFile}
                                    className={'underline underline-offset-4'}
                                >
                                    Télécharger {file.filename_download}
                                </button>
                            ) : null}
                            {showFileDeleted ? (
                                <p className={'text-red-500'}>
                                    Fichier supprimé
                                </p>
                            ) : null}
                            <div className={'text-right'}>
                                le{' '}
                                {new Date(
                                    post.date_created,
                                ).toLocaleDateString()}{' '}
                                à{' '}
                                {new Date(
                                    post.date_created,
                                ).toLocaleTimeString()}{' '}
                                par{' '}
                                {post.user_created.first_name +
                                    ' ' +
                                    post.user_created.last_name}
                            </div>
                        </div>
                        <div className={'mx-10 flex flex-row justify-end'}>
                            <div className={'w-4/5'}>
                                {[...post['responses']]
                                    .sort(
                                        (
                                            a: MessageResponseType,
                                            b: MessageResponseType,
                                        ) => {
                                            return (
                                                new Date(
                                                    a.date_created,
                                                ).getTime() -
                                                new Date(
                                                    b.date_created,
                                                ).getTime()
                                            );
                                        },
                                    )
                                    .map(
                                        (
                                            response: MessageResponseType,
                                            index: number,
                                        ) => {
                                            return (
                                                <Response
                                                    response={response}
                                                    key={index}
                                                />
                                            );
                                        },
                                    )}
                                <WriteResponse
                                    postId={post.id}
                                    subject={subject}
                                    index={index}
                                />
                            </div>
                        </div>
                    </div>
                    {showPopup &&
                        createPortal(
                            <div className={'alertContainer'}>
                                <div className={'alertPopup text-center'}>
                                    <h1>
                                        Êtes-vous sur de vouloir supprimer ce
                                        post ?
                                    </h1>
                                    <h3>"{post.title}"</h3>
                                    <div className={'flex justify-evenly'}>
                                        <button
                                            className={
                                                'bg-green-500 hover:bg-green-700 text-white w-1/6 font-bold py-2 px-4 rounded'
                                            }
                                            onClick={deletePost}
                                        >
                                            Oui
                                        </button>
                                        <button
                                            className={
                                                'bg-red-500 hover:bg-red-700 text-white w-1/6 font-bold py-2 px-4 rounded'
                                            }
                                            onClick={quitPopup}
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            </div>,
                            document.getElementById(
                                'modal-root',
                            ) as HTMLElement,
                        )}
                </>
            )}
        </>
    );
}
