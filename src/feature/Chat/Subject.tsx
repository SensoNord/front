import { useEffect, useState } from 'react';
import { PostType } from '../../types/Chat/PostType';
import Post from '../../components/Chat/Subject/Post';
import '../../styles/Forum.css';
import {createPortal} from 'react-dom';
import DisplayFiles from '../../components/Files/DisplayFiles';
import { ModifiedFileType } from '../../types/File/ModifiedFileType';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import {
    createPostToSubject,
    setCurrentSubjectDisplayWithAllRelatedData,
} from '../../slicers/chat/subject-slice';
import { PayLoadCreateSubjectPost } from '../../slicers/chat/subject-slice-helper';
import {
    UpdateFilePayload,
    createFile,
    downloadFileWithoutURL,
    fetchFileById,
    updateFile,
} from '../../slicers/file/file-slice';

type UploadedFile = {
    file: ModifiedFileType | File;
    uploadOrigin: 'computer' | 'drive';
    name: string;
};

export default function Subject() {
    const {currentSubjectDisplayWithAllRelatedData} = useAppSelector(
        state => state.subject,
    );
    const dispatch = useAppDispatch();
    const [showPopup, setShowPopup] = useState(false);
    const [showPopup2, setShowPopup2] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    const [sortedPost, setSortedPost] = useState<PostType[]>([]);

    useEffect(() => {
        const sortedPost = [
            ...currentSubjectDisplayWithAllRelatedData!.posts,
        ].sort((a: PostType, b: PostType) => {
            return (
                new Date(b.date_created).getTime() -
                new Date(a.date_created).getTime()
            );
        });
        setSortedPost(sortedPost);
    }, [currentSubjectDisplayWithAllRelatedData]);

    function quitPopup() {
        setShowPopup(false);
        setUploadedFile(null);
    }

    function quitPopup2() {
        setShowPopup2(false);
    }

    async function uploadFile(
        downloadedFile: File,
        postTitle: string,
        postMessage: string,
    ) {
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
                } as PayLoadCreateSubjectPost),
            );
        }
    }

    async function handleSubmit(e: {
        preventDefault: () => void;
        target: any;
    }) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const formJson = Object.fromEntries(formData.entries()) as {
            titlePost: string;
            message: string;
        };
        if (formJson.titlePost && formJson.message) {
            setShowPopup(false);
            if (
                uploadedFile &&
                uploadedFile.file instanceof File &&
                uploadedFile.uploadOrigin === 'computer'
            ) {
                // if ((uploadedFile.file instanceof File) && uploadedFile.file?.size !== 0 || (uploadedFile.file instanceof File) && uploadedFile.file.name.length !== 0) {
                await uploadFile(
                    uploadedFile.file,
                    formJson.titlePost,
                    formJson.message,
                );
                setUploadedFile(null);
                // }
            } else if (
                uploadedFile &&
                !(uploadedFile.file instanceof File) &&
                uploadedFile.uploadOrigin === 'drive'
            ) {
                const existingFilePayload = await dispatch(
                    fetchFileById(uploadedFile.file.id),
                );
                const existingFile =
                    existingFilePayload.payload as ModifiedFileType;
                if (existingFile) {
                    const downloadedFilePayload = await dispatch(
                        downloadFileWithoutURL(existingFile),
                    );
                    const downloadedFile =
                        downloadedFilePayload.payload as File;
                    if (downloadedFile) {
                        await uploadFile(
                            downloadedFile,
                            formJson.titlePost,
                            formJson.message,
                        );
                    }
                }
                setUploadedFile(null);
            } else {
                await dispatch(
                    createPostToSubject({
                        subject_id: currentSubjectDisplayWithAllRelatedData!.id,
                        title: formJson.titlePost,
                        message: formJson.message,
                    } as PayLoadCreateSubjectPost),
                );
            }
            dispatch(
                setCurrentSubjectDisplayWithAllRelatedData(
                    currentSubjectDisplayWithAllRelatedData!.id,
                ),
            );
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
        setShowPopup2(false);
    }

    function getFileFromComputer(e: { target: { files: any } }) {
        const f = e.target.files[0];
        setUploadedFile({
            file: f,
            uploadOrigin: 'computer',
            name: f.name,
        } as UploadedFile);
        setShowPopup2(false);
    }

    return (
        <>
            {currentSubjectDisplayWithAllRelatedData && (
                <div style={{height: '100%', position: 'relative'}} className={"overflow-hidden"}>
                    <div className={'text-3xl justify-center flex border-2 border-black mx-auto px-10 pb-2 bg-white z-10'} style={{position: "absolute", maxWidth: 'max-content', right: 0, left: 0}}>
                        <h1>
                            {currentSubjectDisplayWithAllRelatedData!['name']}
                        </h1>
                    </div>
                    <div style={{backgroundColor: 'rgb(239, 246, 255)'}} className={"grid grid-rows-[repeat(11,_minmax(0,_1fr))] grid-flow-col h-full"}>
                        <div className={'row-[span_8_/_span_8] overflow-scroll overflow-x-hidden'} style={{overflowAnchor: 'auto'}}>
                            {sortedPost.map((post: PostType, index: number) => {
                                return (
                                    <>
                                        <div className={"bg-white w-10/12 mx-auto rounded-3xl drop-shadow-xl p-6 my-14"}
                                            key={post.id}
                                        >
                                            <Post
                                                post={post}
                                                key={post.id}
                                                subject={
                                                    currentSubjectDisplayWithAllRelatedData!
                                                }
                                            ></Post>
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                        <div className={"row-span-3 h-full bg-white border-t-2 border-t-gray-400"}>
                            <form
                                className={'text-center overflow-y-scroll h-full'}
                                onSubmit={handleSubmit}
                            >
                                <div className={'p-2 text-xl grid grid-cols-12 h-full'}>
                                    <div className={"col-span-9"}>
                                        <div className="grid grid-cols-1">
                                            <input
                                                type="text"
                                                id="titlePost"
                                                name="titlePost"
                                                className={
                                                    'mt-2 border-2 border-gray-700 rounded-md px-2 py-1'
                                                }
                                                placeholder={"Titre"}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 h-4/6">
                                            <textarea
                                                id="message"
                                                name="message"
                                                className={'mt-2 border-2 border-gray-700 rounded-md h-full px-2 py-1'}
                                                placeholder={"Nouveau topic"}
                                            />
                                        </div>
                                    </div>
                                    <div className={"col-span-3 flex flex-col justify-start"}>
                                        <div>
                                            <button
                                                type={'button'}
                                                className={
                                                    'w-8/12 bg-blue-500 hover:bg-blue-700 text-white mx-auto font-bold py-2 px-4 mb-2 rounded'
                                                }
                                                onClick={() => setShowPopup2(true)}
                                            >
                                                Ajouter un fichier
                                            </button>
                                        </div>
                                        {uploadedFile?.name && (
                                            <>
                                                <span>Fichier : {uploadedFile?.name}</span>
                                                <span>Origine : {uploadedFile?.uploadOrigin === 'drive' ? 'Drive' : 'Ordinateur local'}</span>
                                            </>
                                        )}
                                        <div>
                                            <button
                                                className={
                                                    'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                                }
                                                type={'submit'}
                                            >
                                                Envoyer
                                            </button>
                                        </div>

                                        <div id={'errorMessage'} className={'text-red-600 font-bold text-xl hidden'}>
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
                    <div className={'alertContainer'}>
                        <form
                            className={'alertPopup text-center'}
                            onSubmit={handleSubmit}
                        >
                            <div className={'p-2 text-xl'}>
                                <div className="grid grid-cols-1 mb-10">
                                    <label htmlFor="titlePost">Titre</label>
                                    <input
                                        type="text"
                                        id="titlePost"
                                        name="titlePost"
                                        className={
                                            'mt-2 border-2 border-gray-700 rounded-md'
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-1">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        className={
                                            'mt-2 border-2 border-gray-700 rounded-md'
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-1">
                                    <label htmlFor="file">Fichier</label>
                                    <button
                                        type={'button'}
                                        className={
                                            'w-8/12 bg-blue-500 hover:bg-blue-700 text-white mx-auto font-bold py-2 px-4 mb-2 rounded'
                                        }
                                        onClick={() => setShowPopup2(true)}
                                    >
                                        Ajouter un fichier
                                    </button>
                                    {uploadedFile?.name && (
                                        <span>{uploadedFile?.name}</span>
                                    )}
                                </div>
                            </div>
                            <div
                                id={'errorMessage'}
                                className={
                                    'text-red-600 font-bold text-2xl hidden'
                                }
                            >
                                Veuillez remplir les champs "Titre" et
                                "Message"1
                            </div>
                            <div className="flex flex-row justify-evenly text-white mt-5">
                                <button
                                    className={
                                        'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                                    }
                                    onClick={quitPopup}
                                >
                                    Annuler
                                </button>
                                <button
                                    className={
                                        'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                    }
                                    type={'submit'}
                                >
                                    Envoyer
                                </button>
                            </div>
                        </form>
                    </div>,
                    document.getElementById('modal-root') as HTMLElement,
                )}
            {showPopup2 &&
                createPortal(
                    <div className={'alertContainer'}>
                        <div className={'alertPopup text-center'}>
                            <h1>Drive</h1>
                            <DisplayFiles
                                callbackOnClick={getFileFromDrive}
                                startingFolderId={
                                    currentSubjectDisplayWithAllRelatedData!
                                        .folder_id
                                }
                            />
                            <h1>
                                <input
                                    type="file"
                                    name="file"
                                    id="file"
                                    className={
                                        'w-8/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 rounded'
                                    }
                                    // ref={fileRef}
                                    onChange={getFileFromComputer}
                                />
                            </h1>
                            <button
                                className={
                                    'bg-red-500 hover:bg-red-700 text-white w-1/2 mx-auto font-bold py-2 px-4 rounded'
                                }
                                onClick={quitPopup2}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>,
                    document.getElementById('modal-root') as HTMLElement,
                )}
        </>
    );
}
