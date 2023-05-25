import React, { useEffect, useState } from 'react';
import { PostType } from '../../types/Chat/PostType';
import Post from '../../components/Chat/Subject/Post';
import '../../styles/Popup.css';
import { createPortal } from 'react-dom';
import { ModifiedFileType } from '../../types/File/ModifiedFileType';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import {
    clearCurrentSubjectDisplayWithAllRelatedData,
    createPostToSubject,
    fetchSubjectByIdAndPage,
} from '../../slicers/chat/subject-slice';
import { PayLoadCreateSubjectPost, PayloadFetchSubjectByIdAndPage } from '../../slicers/chat/subject-slice-helper';
import {
    UpdateFilePayload,
    createFile,
    downloadFileWithoutURL,
    fetchFileById,
    updateFile,
} from '../../slicers/file/file-slice';
import AddFilePopup from '../../components/Chat/AddFilePopup';
import CreateSondage from '../../components/Poll/CreatePoll';
import { PaperAirplaneIcon, DocumentPlusIcon, TrashIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { directus } from '../../libraries/directus';
import SubjectAddPersonMenu from '../../components/Chat/Create/SubjectAddPersonMenu';

type UploadedFile = {
    file: ModifiedFileType | File;
    uploadOrigin: 'computer' | 'drive';
    name: string;
};

export default function Subject() {
    const { currentSubjectDisplayWithAllRelatedData } = useAppSelector(state => state.subject);
    const dispatch = useAppDispatch();
    const [showPopup, setShowPopup] = useState(false);
    const [showAddPersonPopup, setShowAddPersonPopup] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    const [sortedPost, setSortedPost] = useState<PostType[]>([]);
    const [sondageId, setSondageId] = useState<number | null>(null);
    const [nomSondage, setNomSondage] = useState('');
    const [pageNb, setPageNb] = useState<number>(2);
    const [totalNbPost, setTotalNbPost] = useState<number>(0);

    const resetForm = () => {
        setTitle('');
        setMessage('');
        setUploadedFile(null);
        setSondageId(null);
    };

    useEffect(() => {
        if (currentSubjectDisplayWithAllRelatedData?.id) {
            try {
                const fetchNbPost = async () => {
                    let response = (await directus.items('posts').readByQuery({
                        filter: {
                            subject_id: {
                                _eq: currentSubjectDisplayWithAllRelatedData?.id,
                            },
                        },
                        aggregate: {
                            count: 'id',
                        },
                    })) as { data: [{ count: { id: number } }] };
                    setTotalNbPost(response.data[0].count.id);
                };
                fetchNbPost();
            } catch (error) {
                console.error('Erreur lors de la récupération du nombre de post:', error);
                throw error;
            }
        }
    }, [currentSubjectDisplayWithAllRelatedData?.id]);

    useEffect(() => {
        if (currentSubjectDisplayWithAllRelatedData && currentSubjectDisplayWithAllRelatedData.posts) {
            const sortedPost = [...currentSubjectDisplayWithAllRelatedData!.posts].sort((a: PostType, b: PostType) => {
                return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
            });
            setSortedPost(sortedPost);
            resetForm();
        }
    }, [currentSubjectDisplayWithAllRelatedData]);

    function quitPopup() {
        setShowPopup(false);
    }

    async function uploadFile(downloadedFile: File, postTitle: string, postMessage: string) {
        const createdFilePayload = await dispatch(createFile(downloadedFile));
        const createdFile = createdFilePayload.payload as ModifiedFileType;
        await dispatch(
            updateFile({
                file: createdFile,
                chatId: currentSubjectDisplayWithAllRelatedData!.id,
                folderId: currentSubjectDisplayWithAllRelatedData!.folder_id,
                chatType: 'subject',
            } as UpdateFilePayload),
        );
        if (createdFile) {
            await dispatch(
                createPostToSubject({
                    subject_id: currentSubjectDisplayWithAllRelatedData!.id,
                    title: postTitle,
                    message: postMessage,
                    file_id: createdFile.id,
                    sondage_id: sondageId,
                } as PayLoadCreateSubjectPost),
            );
        }
    }

    const updateSubject = async () => {
        let subjectId = currentSubjectDisplayWithAllRelatedData?.id;
        dispatch(clearCurrentSubjectDisplayWithAllRelatedData());
        for (let i = 1; i <= pageNb; i++) {
            await dispatch(
                fetchSubjectByIdAndPage({ subjectId: subjectId, page: i } as PayloadFetchSubjectByIdAndPage),
            );
        }
    };

    async function handleSubmit(e: { preventDefault: () => void; target: any }) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const formJson = Object.fromEntries(formData.entries()) as {
            titlePost: string;
            message: string;
        };
        if (formJson.titlePost && formJson.message) {
            if (uploadedFile && uploadedFile.file instanceof File && uploadedFile.uploadOrigin === 'computer') {
                await uploadFile(uploadedFile.file, formJson.titlePost, formJson.message);
            } else if (uploadedFile && !(uploadedFile.file instanceof File) && uploadedFile.uploadOrigin === 'drive') {
                const existingFile = (await dispatch(fetchFileById(uploadedFile.file.id))).payload as ModifiedFileType;
                if (existingFile && existingFile.folder !== currentSubjectDisplayWithAllRelatedData?.folder_id) {
                    const downloadedFile = (await dispatch(downloadFileWithoutURL(existingFile))).payload as File;
                    if (downloadedFile) {
                        await uploadFile(downloadedFile, formJson.titlePost, formJson.message);
                    }
                } else {
                    await dispatch(
                        createPostToSubject({
                            subject_id: currentSubjectDisplayWithAllRelatedData!.id,
                            title: formJson.titlePost,
                            message: formJson.message,
                            file_id: uploadedFile.file.id,
                            sondage_id: sondageId,
                        } as PayLoadCreateSubjectPost),
                    );
                }
            } else {
                await dispatch(
                    createPostToSubject({
                        subject_id: currentSubjectDisplayWithAllRelatedData!.id,
                        title: formJson.titlePost,
                        message: formJson.message,
                        sondage_id: sondageId,
                    } as PayLoadCreateSubjectPost),
                );
            }
            await updateSubject();
            resetForm();
        } else {
            document.getElementById('errorMessage')?.classList.remove('hidden');
        }
    }

    function getFileFromDrive(file: ModifiedFileType) {
        setUploadedFile({
            file: file,
            uploadOrigin: 'drive',
            name: file.filename_download,
        } as UploadedFile);
        setShowPopup(false);
    }

    function getFileFromComputer(e: { target: { files: any } }) {
        const f = e.target.files[0];
        setUploadedFile({
            file: f,
            uploadOrigin: 'computer',
            name: f.name,
        } as UploadedFile);
        setShowPopup(false);
    }

    const handleChangeTitle = (e: { target: { value: React.SetStateAction<string> } }) => {
        setTitle(e.target.value);
    };

    const handleChangeMessage = (e: { target: { value: React.SetStateAction<string> } }) => {
        setMessage(e.target.value);
    };

    const handleCloseAddPersonPopup = () => {
        setShowAddPersonPopup(false);
    };

    const handleAddPost = async () => {
        await dispatch(
            fetchSubjectByIdAndPage({
                subjectId: currentSubjectDisplayWithAllRelatedData!.id,
                page: pageNb,
            } as PayloadFetchSubjectByIdAndPage),
        );
        setPageNb(pageNb + 1);
    };

    return (
        <>
            {currentSubjectDisplayWithAllRelatedData && (
                <div style={{ height: '100%', position: 'relative' }} className={'overflow-hidden'}>
                    <div
                        className={
                            'text-3xl flex items-center border-b-2 border-gray-300 mx-auto px-4 pb-2 bg-white z-10'
                        }
                        style={{
                            position: 'absolute',
                            right: 0,
                            left: 0,
                        }}
                    >
                        <h1 className="flex-grow text-center">{currentSubjectDisplayWithAllRelatedData!['name']}</h1>
                        <AdjustmentsHorizontalIcon
                            className={'w-7 h-7 cursor-pointer hover:text-gray-500'}
                            onClick={() => setShowAddPersonPopup(true)}
                        />
                    </div>
                    <div
                        style={{ backgroundColor: 'rgb(239, 246, 255)' }}
                        className={'grid grid-rows-[repeat(11,_minmax(0,_1fr))] grid-flow-col h-full'}
                    >
                        <div
                            className={'row-[span_8_/_span_8] overflow-scroll overflow-x-hidden'}
                            style={{ overflowAnchor: 'auto' }}
                        >
                            {sortedPost.map((post: PostType, index) => {
                                return (
                                    <div
                                        className={'bg-white w-10/12 mx-auto rounded-3xl drop-shadow-xl p-6 my-14'}
                                        key={index}
                                    >
                                        <Post
                                            post={post}
                                            key={post.id}
                                            subject={currentSubjectDisplayWithAllRelatedData!}
                                            updateSubject={updateSubject}
                                        ></Post>
                                    </div>
                                );
                            })}
                            {sortedPost.length < totalNbPost && (
                                <div className={'text-center'}>
                                    <button className={'mt-6 mb-4 bg-blue-300 p-2 rounded-xl'} onClick={handleAddPost}>
                                        Afficher plus de topics
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className={'row-span-3 h-full bg-white border-t-2 border-gray-300'}>
                            <form className={'text-center overflow-y-scroll h-full'} onSubmit={handleSubmit}>
                                <div className={'p-2 text-xl grid grid-cols-12 h-full'}>
                                    <div className={'col-span-9'}>
                                        <div className="grid grid-cols-1">
                                            <input
                                                type="text"
                                                id="titlePost"
                                                name="titlePost"
                                                className={'mt-2 border border-gray-700 rounded-md px-2 py-1'}
                                                placeholder={'Titre'}
                                                value={title}
                                                onChange={handleChangeTitle}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 h-4/6">
                                            <textarea
                                                id="message"
                                                name="message"
                                                className={'mt-2 border border-gray-700 rounded-md h-full px-2 py-1'}
                                                placeholder={'Nouveau topic'}
                                                value={message}
                                                onChange={handleChangeMessage}
                                            />
                                        </div>
                                    </div>
                                    <div className={'col-span-3 flex flex-col justify-start items-center'}>
                                        <div className={'flex'}>
                                            <div>
                                                <button
                                                    type={'button'}
                                                    className={'mx-2 px-1 my-1 py-1 cursor-pointer'}
                                                    onClick={() => setShowPopup(true)}
                                                >
                                                    <DocumentPlusIcon className={'w-7 h-7 hover:text-gray-500'} />
                                                </button>
                                            </div>
                                            <CreateSondage
                                                setSondageId={setSondageId}
                                                nomSondage={nomSondage}
                                                setNomSondage={setNomSondage}
                                            />
                                            <div>
                                                <button
                                                    className={'mx-2 px-1 my-1 py-1 cursor-pointer'}
                                                    type={'submit'}
                                                >
                                                    <PaperAirplaneIcon className={'w-7 h-7 hover:text-gray-500'} />
                                                </button>
                                            </div>
                                        </div>
                                        {sondageId !== 0 && sondageId !== null && (
                                            <div className={'flex gap-10 items-center'}>
                                                <div className={'flex flex-col items-start'}>
                                                    <span className={'text-lg'}>Sondage créé</span>
                                                    <span className={'text-lg'}>"{nomSondage}"</span>
                                                </div>
                                                <button
                                                    className={'mx-2 px-1 my-1 py-1 cursor-pointer'}
                                                    type={'button'}
                                                    onClick={() => setSondageId(null)}
                                                >
                                                    <TrashIcon
                                                        className={'w-7 h-7 cursor-pointer hover:text-red-500'}
                                                    />
                                                </button>
                                            </div>
                                        )}
                                        {uploadedFile?.name && (
                                            <div className={'flex gap-10 text-lg'}>
                                                <div className={'flex flex-col items-start'}>
                                                    <span>Fichier : {uploadedFile?.name}</span>
                                                    <span>
                                                        Origine :{' '}
                                                        {uploadedFile?.uploadOrigin === 'drive'
                                                            ? 'Drive'
                                                            : 'Ordinateur local'}
                                                    </span>
                                                </div>
                                                <TrashIcon
                                                    className={'w-7 h-7 cursor-pointer hover:text-red-500'}
                                                    onClick={() => setUploadedFile(null)}
                                                />
                                            </div>
                                        )}
                                        <div
                                            id={'errorMessage'}
                                            className={'text-red-600 font-bold w-8/12 text-lg hidden'}
                                        >
                                            Veuillez remplir les champs "Titre" et "Nouveau topic"
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showPopup &&
                createPortal(
                    <AddFilePopup
                        getFileFromDrive={getFileFromDrive}
                        folderId={currentSubjectDisplayWithAllRelatedData!.folder_id}
                        getFileFromComputer={getFileFromComputer}
                        quitPopup={quitPopup}
                    />,
                    document.getElementById('modal-root') as HTMLElement,
                )}
            {showAddPersonPopup &&
                createPortal(
                    <SubjectAddPersonMenu handleCloseAddPersonPopup={handleCloseAddPersonPopup} />,
                    document.getElementById('modal-root') as HTMLElement,
                )}
        </>
    );
}
