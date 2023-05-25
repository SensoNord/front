import {useEffect, useRef, useState} from 'react';
import {PostType} from '../../../types/Chat/PostType';
import {ResponseType} from '../../../types/Chat/ResponseType';
import Response from './Response';
import WriteResponse from './WriteResponse';
import {SubjectType} from '../../../types/Chat/SubjectType';
import {ModifiedFileType} from '../../../types/File/ModifiedFileType';
import {createPortal} from 'react-dom';
import LoadingSpinner from '../../LoadingSpinner';
import {useAppDispatch, useAppSelector} from '../../../App/hooks';
import {
    deletePostById,
    updatePostMessageById,
} from '../../../slicers/chat/subject-slice';
import {downloadFile} from '../../../slicers/file/file-slice';
import {PayloadFetchSubjectByIdAndPage, PayLoadUpdateSubjectPost} from '../../../slicers/chat/subject-slice-helper';
import {FileTypeWithStatus} from '../../../types/File/FileTypeWithStatus';
import {useFetchFile} from '../../../customHook/useFetchFile';
import DownloadableFile from '../DownloadableFile';
import NameAndDate from '../../Field/NameAndDate';
import Sondage from '../../Poll/Poll';
import {directus} from "../../../libraries/directus";

type Props = {
    post: PostType;
    subject: SubjectType;
    updateSubject: Function;
};

const responseField = [
    'user_created.first_name',
    'user_created.last_name',
    'user_created.id',
    'date_created',
    'user_updated.first_name',
    'user_updated.last_name',
    'date_updated.id',
    'date_updated',
    'message',
    'file_id',
    'id',
]

export default function Post(props: Props) {
    const {post, subject, updateSubject} = props;
    const dispatch = useAppDispatch();
    const {connectedUser, connectedUserRole} = useAppSelector(state => state.auth);

    const [showPopup, setShowPopup] = useState(false);
    const [file, setFile] = useState<FileTypeWithStatus>({} as FileTypeWithStatus);
    const [postIsBeingEdited, setPostIsBeingEdited] = useState(false);
    const textAreaRef = useRef(null) as { current: any };
    const isLoaded = true;
    const [isAdministrator, setIsAdministrator] = useState(null as boolean | null);
    const [isPostOwner, setIsPostOwner] = useState(null as boolean | null);
    const [responsesList, setResponsesList] = useState([] as ResponseType[]);
    const [responsesPageNb, setResponsesPageNb] = useState(1);
    const [totalNbResponses, setTotalNbResponses] = useState<number>(0);

    useEffect(() => {
        setIsAdministrator(connectedUserRole.name === 'Administrator');
        setIsPostOwner(connectedUser.id === post.user_created.id);
    }, [connectedUser, connectedUserRole, post.user_created.id]);

    useEffect(() => {
        const fetchResponsesList = async () => {
            let msgList = await directus.items('responses').readByQuery({
                filter: {
                    post_id: {
                        _eq: post.id
                    }
                },
                fields: responseField,
                limit: 5,
                // @ts-ignore
                sort: '-date_created',
                page: 1,
            });
            setResponsesList(msgList.data as ResponseType[]);

            let nbResponses = await directus.items('responses').readByQuery({
                filter: {
                    post_id: {
                        _eq: post.id
                    }
                },
                aggregate: {
                    count: "id"
                }
            }) as { data: [{ count: { id: number } }] };
            setTotalNbResponses(nbResponses.data[0].count.id);
        }
        fetchResponsesList();
    }, [post.id]);

    useFetchFile({
        file_id: post.file_id,
        setFile: setFile,
    });

    function quitPopup() {
        setShowPopup(false);
    }


    async function deletePost() {
        await dispatch(deletePostById(post.id));
        await updateSubject();
        quitPopup();
    }

    async function updatePost() {
        await dispatch(
            updatePostMessageById({
                id: post.id,
                message: textAreaRef.current.value,
            } as PayLoadUpdateSubjectPost),
        );
        await updateSubject();
        setPostIsBeingEdited(false);
    }

    async function handleDownloadFile() {
        await dispatch(downloadFile(file.file as ModifiedFileType));
    }

    async function updateResponsesList() {
        let msgList = await directus.items('responses').readByQuery({
            filter: {
                post_id: {
                    _eq: post.id
                }
            },
            fields: responseField,
            limit: 5 * responsesPageNb,
            // @ts-ignore
            sort: '-date_created',
        });
        setResponsesList(msgList.data as ResponseType[]);
    }

    async function handleShowMoreResponses() {
        let response = await directus.items('responses').readByQuery({
            filter: {
                post_id: {
                    _eq: post.id
                }
            },
            fields: responseField,
            limit: 5,
            // @ts-ignore
            sort: '-date_created',
            page: responsesPageNb + 1,
        });
        setResponsesList([...responsesList, ...response.data as ResponseType[]]);
        setResponsesPageNb(responsesPageNb + 1);
    }

    return (
        <>
            {!isLoaded ? (
                <LoadingSpinner/>
            ) : (
                <>
                    <div className={'w-full'}>
                        <div className={'flex justify-between'}>
                            <NameAndDate date_created={post.date_created} user_created={post.user_created}/>
                            <div>
                                {isPostOwner && !postIsBeingEdited && (
                                    //  Bouton modifier
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5 inline mx-1"
                                        onClick={() => setPostIsBeingEdited(true)}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                        />
                                    </svg>
                                )}
                                {(isPostOwner || isAdministrator) && !postIsBeingEdited && (
                                    // Bouton supprimer
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5 inline mx-1"
                                        onClick={() => setShowPopup(true)}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                    </svg>
                                )}
                                {postIsBeingEdited && (
                                    <div className={'flex'}>
                                        {/* Bouton annulé */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                            onClick={() => setPostIsBeingEdited(false)}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                        {/* Bouton validé */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                            onClick={updatePost}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.5 12.75l6 6 9-13.5"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={'p-4 rounded-lg'} style={{backgroundColor: 'rgb(219, 234, 254)'}}>
                            <div>
                                <h2 className={'text-2xl font-bold'}>{post.title}</h2>
                            </div>
                            {!postIsBeingEdited && <p className={'text-1xl whitespace-pre-wrap'}>{post.message}</p>}
                            {postIsBeingEdited && (
                                <div className={'m-2'}>
                                    <textarea
                                        className={'text-1xl whitespace-pre-wrap w-full'}
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
                                </div>
                            )}
                            {post.sondage_id && <Sondage sondage_id={post.sondage_id}/>}
                            <DownloadableFile file={file} handleDownloadFile={handleDownloadFile}/>
                        </div>
                        <div className={'w-full'}>
                            {responsesList.length < totalNbResponses && (
                                <div className={'text-center'}>
                                    <button className={"mt-6 mb-4 bg-blue-300 p-2 rounded-xl"} onClick={handleShowMoreResponses}>
                                        Afficher plus de réponse
                                    </button>
                                </div>
                            )}
                            {responsesList
                                .sort((a: ResponseType, b: ResponseType) => {
                                    return new Date(a.date_created).getTime() - new Date(b.date_created).getTime();
                                })
                                .map((response: ResponseType, index) => {
                                    return (
                                        <div
                                            className={`flex ${
                                                response.user_created.id === connectedUser.id
                                                    ? 'justify-end'
                                                    : 'justify-start'
                                            }`}
                                            key={index}
                                        >
                                            <div className={'w-7/12'}>
                                                <Response
                                                    response={response}
                                                    subjectId={subject.id}
                                                    key={index}
                                                    align={
                                                        response.user_created.id === connectedUser.id ? 'right' : 'end'
                                                    }
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            <WriteResponse postId={post.id} subject={subject} key={post.id + 'writeResponse'} updateResponsesList={updateResponsesList}/>
                        </div>
                    </div>
                    {showPopup &&
                        createPortal(
                            <div className={'alertContainer'}>
                                <div className={'alertPopup text-center'}>
                                    <h1>Êtes-vous sur de vouloir supprimer ce post ?</h1>
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
                            document.getElementById('modal-root') as HTMLElement,
                        )}
                </>
            )}
        </>
    );
}
