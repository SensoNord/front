import { useEffect, useRef, useState } from 'react';
import { PostType } from '../../types/Chat/PostType';
import Post from '../../components/Chat/Subject/Post';
import '../../styles/Forum.css';
import { createPortal } from 'react-dom';
import DisplayFiles from '../../components/Files/DisplayFiles';
import { ModifiedFileType } from '../../types/Chat/ModifiedFileType';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import {
    createPostToSubject,
    setCurrentSubjectDisplayWithAllRelatedData,
} from '../../slicers/subject-slice';
import { PayLoadCreatePost } from '../../slicers/subject-slice-helper';
import {
    UpdateFilePayload,
    createFile,
    downloadFileWithoutURL,
    fetchFileById,
    updateFile,
} from '../../slicers/file-slice';

type UploadedFile = {
    file: ModifiedFileType | File;
    uploadOrigin: 'computer' | 'drive';
    name: string;
};

export default function Subject() {
    const { currentSubjectDisplayWithAllRelatedData } = useAppSelector(
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

    function createPostButton() {
        setShowPopup(true);
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
                subjectId: currentSubjectDisplayWithAllRelatedData!.id,
                folderId: currentSubjectDisplayWithAllRelatedData!.folder_id,
            } as UpdateFilePayload),
        );
        if (createdFile) {
            await dispatch(
                createPostToSubject({
                    subject_id: currentSubjectDisplayWithAllRelatedData!.id,
                    title: postTitle,
                    message: postMessage,
                    file_id: createdFile.id,
                } as PayLoadCreatePost),
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
                    } as PayLoadCreatePost),
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
        // fileRef.current.value = '';

        setUploadedFile({
            file: file,
            uploadOrigin: 'drive',
            name: file.filename_download,
        } as UploadedFile);

        // setFile(null);
        // setFileId(file.id);
        // setFileName(file.filename_download);
        setShowPopup2(false);
    }

    function getFileFromComputer(e: { target: { files: any } }) {
        const f = e.target.files[0];

        setUploadedFile({
            file: f,
            uploadOrigin: 'computer',
            name: f.name,
        } as UploadedFile);

        // setFile(f);
        // setFileId(null);
        // setFileName(f.name);
        setShowPopup2(false);
    }

    return (
        <>
            {currentSubjectDisplayWithAllRelatedData && (
                <div>
                    <div className={'grid grid-cols-12'}>
                        <h1 className="col-span-6 mx-10 my-10 pb-10 text-4xl font-bold underline">
                            {currentSubjectDisplayWithAllRelatedData!['name']}
                        </h1>
                        <div
                            className={
                                'col-end-13 col-span-3 flex flex-col justify-center items-center'
                            }
                        >
                            <button
                                onClick={createPostButton}
                                className={
                                    'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                }
                            >
                                Nouveau post
                            </button>
                        </div>
                    </div>
                    <div>
                        {sortedPost.map((post: PostType, index: number) => {
                            return (
                                <Post
                                    post={post}
                                    key={index}
                                    subject={
                                        currentSubjectDisplayWithAllRelatedData!
                                    }
                                    index={index}
                                ></Post>
                            );
                        })}
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
