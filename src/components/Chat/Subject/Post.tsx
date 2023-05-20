import { useEffect, useRef, useState } from 'react';
import { PostType } from '../../../types/Chat/PostType';
import { ResponseType } from '../../../types/Chat/ResponseType';
import Response from './Response';
import WriteResponse from './WriteResponse';
import { SubjectType } from '../../../types/Chat/SubjectType';
import {
    ModifiedFileType,
} from '../../../types/File/ModifiedFileType';
import { createPortal } from 'react-dom';
import LoadingSpinner from '../../LoadingSpinner';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import {
    deletePostById,
    setCurrentSubjectDisplayWithAllRelatedData,
    updatePostMessageById,
} from '../../../slicers/chat/subject-slice';
import { downloadFile } from '../../../slicers/file/file-slice';
import { PayLoadUpdateSubjectPost } from '../../../slicers/chat/subject-slice-helper';
import { FileTypeWithStatus } from '../../../types/File/FileTypeWithStatus';
import { useFetchFile } from '../../../customHook/useFetchFile';
import DownloadableFile from '../DownloadableFile';
import NameAndDate from '../../Field/NameAndDate';

type Props = {
    post: PostType;
    subject: SubjectType;
    index: number;
};

export default function Post(props: Props) {
    const { post, subject, index } = props;
    const dispatch = useAppDispatch();
    const { connectedUser, connectedUserRole } = useAppSelector(state => state.auth);

    const [showPopup, setShowPopup] = useState(false);
    const [file, setFile] = useState<FileTypeWithStatus>({} as FileTypeWithStatus);
    const [postIsBeingEdited, setPostIsBeingEdited] = useState(false);
    const textAreaRef = useRef(null) as { current: any };
    // const [isLoaded, setIsLoaded] = useState(true);
    const isLoaded = true;
    const [isAdministrator, setIsAdministrator] = useState(
        null as boolean | null,
    );
    const [isPostOwner, setIsPostOwner] = useState(null as boolean | null);

    useEffect(() => {
        setIsAdministrator(connectedUserRole.name === 'Administrator');
        setIsPostOwner(connectedUser.id === post.user_created.id);
    }, [connectedUser, connectedUserRole, post.user_created.id]);

    useFetchFile({
        file_id: post.file_id,
        setFile: setFile,
    })

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
            } as PayLoadUpdateSubjectPost),
        );
        dispatch(setCurrentSubjectDisplayWithAllRelatedData(subject.id));
        setPostIsBeingEdited(false);
    }

    async function handleDownloadFile() {
        await dispatch(downloadFile(file.file as ModifiedFileType));
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
                            < DownloadableFile
                                file={file}
                                handleDownloadFile={handleDownloadFile}
                            />
                            <div className={'text-right'}>
                                < NameAndDate
                                    user_created={post.user_created}
                                    date_created={post.date_created}
                                />
                            </div>
                        </div>
                        <div className={'mx-10 flex flex-row justify-end'}>
                            <div className={'w-4/5'}>
                                {[...post['responses']]
                                    .sort(
                                        (
                                            a: ResponseType,
                                            b: ResponseType,
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
                                            response: ResponseType,
                                            index: number,
                                        ) => {
                                            return (
                                                <Response
                                                    response={response}
                                                    subjectId={subject.id}
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
