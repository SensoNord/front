import {useEffect, useState} from 'react';
import {PostType} from '../../types/Chat/PostType';
import Post from '../../components/Chat/Subject/Post';
import '../../styles/Popup.css';
import {createPortal} from 'react-dom';
import {ModifiedFileType} from '../../types/File/ModifiedFileType';
import {useAppDispatch, useAppSelector} from '../../App/hooks';
import {
    createPostToSubject,
    setCurrentSubjectDisplayWithAllRelatedData,
} from '../../slicers/chat/subject-slice';
import {PayLoadCreateSubjectPost} from '../../slicers/chat/subject-slice-helper';
import {
    UpdateFilePayload,
    createFile,
    downloadFileWithoutURL,
    fetchFileById,
    updateFile,
} from '../../slicers/file/file-slice';
import AddFilePopup from "../../components/Chat/AddFilePopup";
import CreateSondage from '../../components/Poll/CreatePoll';

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
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    const [sortedPost, setSortedPost] = useState<PostType[]>([]);
    const [sondageId, setSondageId] = useState<number | null>(null);

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
            await dispatch(createPostToSubject({
                    subject_id: currentSubjectDisplayWithAllRelatedData!.id,
                    title: postTitle,
                    message: postMessage,
                    file_id: createdFile.id,
                    sondage_id: sondageId,
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
            if (uploadedFile && uploadedFile.file instanceof File && uploadedFile.uploadOrigin === 'computer') {
                await uploadFile(uploadedFile.file, formJson.titlePost, formJson.message);
                setUploadedFile(null);
            } else if (uploadedFile && !(uploadedFile.file instanceof File) && uploadedFile.uploadOrigin === 'drive') {
                const existingFile = (await dispatch(fetchFileById(uploadedFile.file.id))).payload as ModifiedFileType;
                if (existingFile && existingFile.folder !== currentSubjectDisplayWithAllRelatedData?.folder_id) {
                    const downloadedFile = (await dispatch(downloadFileWithoutURL(existingFile))).payload as File;
                    if (downloadedFile) {
                        await uploadFile(downloadedFile, formJson.titlePost, formJson.message);
                    }
                }
                setUploadedFile(null);
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
            dispatch(setCurrentSubjectDisplayWithAllRelatedData(currentSubjectDisplayWithAllRelatedData!.id));
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

    return (
        <>
            {currentSubjectDisplayWithAllRelatedData && (
                <div
                    style={{ height: '100%', position: 'relative' }}
                    className={'overflow-hidden'}
                >
                    <div
                        className={
                            'text-3xl justify-center flex border-b-2 border-gray-300 mx-auto px-10 pb-2 bg-white z-10'
                        }
                        style={{
                            position: 'absolute',
                            right: 0,
                            left: 0,
                        }}
                    >
                        <h1>
                            {currentSubjectDisplayWithAllRelatedData!['name']}
                        </h1>
                    </div>
                    <div
                        style={{ backgroundColor: 'rgb(239, 246, 255)' }}
                        className={
                            'grid grid-rows-[repeat(11,_minmax(0,_1fr))] grid-flow-col h-full'
                        }
                    >
                        <div
                            className={
                                'row-[span_8_/_span_8] overflow-scroll overflow-x-hidden'
                            }
                            style={{ overflowAnchor: 'auto' }}
                        >
                            {sortedPost.map((post: PostType, index: number) => {
                                return (
                                    <div className={'bg-white w-10/12 mx-auto rounded-3xl drop-shadow-xl p-6 my-14'}
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
                                );
                            })}
                        </div>
                        <div
                            className={
                                'row-span-3 h-full bg-white border-t-2 border-t-gray-400'
                            }
                        >
                            <form
                                className={
                                    'text-center overflow-y-scroll h-full'
                                }
                                onSubmit={handleSubmit}
                            >
                                <div
                                    className={
                                        'p-2 text-xl grid grid-cols-12 h-full'
                                    }
                                >
                                    <div className={'col-span-9'}>
                                        <div className="grid grid-cols-1">
                                            <input
                                                type="text"
                                                id="titlePost"
                                                name="titlePost"
                                                className={
                                                    'mt-2 border-2 border-gray-700 rounded-md px-2 py-1'
                                                }
                                                placeholder={'Titre'}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 h-4/6">
                                            <textarea
                                                id="message"
                                                name="message"
                                                className={
                                                    'mt-2 border-2 border-gray-700 rounded-md h-full px-2 py-1'
                                                }
                                                placeholder={'Nouveau topic'}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className={
                                            'col-span-3 flex flex-col justify-start'
                                        }
                                    >
                                        <div>
                                            <button
                                                type={'button'}
                                                className={
                                                    'w-8/12 bg-blue-500 hover:bg-blue-700 text-white mx-auto font-bold py-2 px-4 mb-2 rounded'
                                                }
                                                onClick={() => setShowPopup(true)}
                                            >
                                                Ajouter un fichier
                                            </button>
                                        </div>
                                        {uploadedFile?.name && (
                                            <>
                                                <span>
                                                    Fichier :{' '}
                                                    {uploadedFile?.name}
                                                </span>
                                                <span>
                                                    Origine :{' '}
                                                    {uploadedFile?.uploadOrigin ===
                                                    'drive'
                                                        ? 'Drive'
                                                        : 'Ordinateur local'}
                                                </span>
                                            </>
                                        )}
                                        <CreateSondage
                                            setSondageId={setSondageId}
                                        />
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

                                        <div
                                            id={'errorMessage'}
                                            className={
                                                'text-red-600 font-bold text-xl hidden'
                                            }
                                        >
                                            Veuillez remplir les champs "Titre"
                                            et "Nouveau topic"
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
        </>
    );
}
