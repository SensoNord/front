import { useRef } from 'react';
import { SubjectType } from '../../../types/Chat/SubjectType';
import { createPortal } from 'react-dom';
import { useAppDispatch } from '../../../App/hooks';
import { createResponseToPost, setCurrentSubjectDisplayWithAllRelatedData } from '../../../slicers/chat/subject-slice';
import { PayLoadCreateSubjectMessage } from '../../../slicers/chat/subject-slice-helper';
import { useFileManagement } from '../../../customHook/useFileManagement';
import AddFilePopup from '../AddFilePopup';
import { PaperAirplaneIcon, DocumentPlusIcon, TrashIcon } from '@heroicons/react/24/outline';

type Props = {
    postId: string;
    subject: SubjectType;
};

export default function WriteResponse(props: Props) {
    const { postId, subject } = props;
    const dispatch = useAppDispatch();
    const formRef = useRef(null) as { current: any };

    const {
        fileRef,
        uploadedFile,
        setUploadedFile,
        handleFileUpload,
        getFileFromDrive,
        getFileFromComputer,
        showPopup,
        setShowPopup,
        quitPopup,
    } = useFileManagement({
        chat: subject,
        chatType: 'subject',
    });

    async function handleSubmit(e: { preventDefault: () => void; target: any }) {
        e.preventDefault();

        const responseMessage = e.target[0].value.trimEnd();

        if (responseMessage.length === 0) {
            alert('Vous ne pouvez pas envoyez de message vide');
            return;
        }

        if (uploadedFile) {
            const createdFile = await handleFileUpload();
            if (createdFile) {
                await dispatch(
                    createResponseToPost({
                        subject_id: subject.id,
                        post_id: postId,
                        message: responseMessage,
                        file_id: createdFile.id,
                    } as PayLoadCreateSubjectMessage),
                );
            }
            setUploadedFile(null);
        } else {
            await dispatch(
                createResponseToPost({
                    subject_id: subject.id,
                    post_id: postId,
                    message: responseMessage,
                } as PayLoadCreateSubjectMessage),
            );
        }
        dispatch(setCurrentSubjectDisplayWithAllRelatedData(subject.id));

        formRef.current.reset();
    }

    return (
        <>
            <form ref={formRef} onSubmit={handleSubmit} className={'grid grid-cols-12 mt-10'}>
                <span className={'col-span-9 flex flex-col'}>
                    <textarea
                        className={'w-full p-2 mt-2 border border-gray-700 rounded-md'}
                        rows={2}
                        cols={30}
                        placeholder={'Nouveau Message'}
                    ></textarea>
                </span>
                <span className={'col-start-10 col-span-3 flex flex-col justify-start items-center'}>
                    <div>
                        <button
                            type={'button'}
                            className={'mx-2 px-1 my-1 py-1 cursor-pointer'}
                            onClick={() => setShowPopup(true)}
                        >
                            <DocumentPlusIcon className={'w-7 h-7 cursor-pointer hover:text-gray-500'} />
                        </button>
                        <button type="submit" className={'mx-2 px-1 my-1 py-1 cursor-pointer'}>
                            <PaperAirplaneIcon className={'w-7 h-7 cursor-pointer hover:text-gray-500'} />
                        </button>
                    </div>
                    {uploadedFile?.name && (
                        <div className={'flex gap-10'}>
                            <div className={'flex flex-col items-start'}>
                                <span>Fichier : {uploadedFile?.name}</span>
                                <span>
                                    Origine : {uploadedFile?.uploadOrigin === 'drive' ? 'Drive' : 'Ordinateur local'}
                                </span>
                            </div>
                            <TrashIcon
                                className={'w-7 h-7 cursor-pointer hover:text-red-500'}
                                onClick={() => setUploadedFile(null)}
                            />
                        </div>
                    )}
                </span>
            </form>
            {showPopup &&
                createPortal(
                    <AddFilePopup
                        getFileFromDrive={getFileFromDrive}
                        folderId={subject.folder_id}
                        fileRef={fileRef}
                        getFileFromComputer={getFileFromComputer}
                        quitPopup={quitPopup}
                    />,
                    document.getElementById('modal-root') as HTMLElement,
                )}
        </>
    );
}
