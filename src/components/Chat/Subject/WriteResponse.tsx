import { useRef } from 'react';
import { SubjectType } from '../../../types/Chat/SubjectType';
import { createPortal } from 'react-dom';
import DisplayFiles from '../../Files/DisplayFiles';
import { useAppDispatch } from '../../../App/hooks';
import { createResponseToPost, setCurrentSubjectDisplayWithAllRelatedData } from '../../../slicers/chat/subject-slice';
import { PayLoadCreateSubjectMessage } from '../../../slicers/chat/subject-slice-helper';
import { useFileManagement } from '../../../customHook/useFileManagement';

type Props = {
    postId: string;
    subject: SubjectType;
    index: number;
};

export default function WriteResponse(props: Props) {
    const { postId, subject, index } = props;
    const dispatch = useAppDispatch();
    const formRef = useRef(null) as { current: any };

    const {
        fileRef,
        fileName,
        file,
        fileId,
        handleFileUpload,
        getFileFromDrive,
        getFileFromComputer,
        clearFile,
        showPopup,
        setShowPopup,
        quitPopup,
    } = useFileManagement({
        chat: subject,
        chatType: 'subject',
    })

    async function handleSubmit(e: {
        preventDefault: () => void;
        target: any;
    }) {
        e.preventDefault();

        const responseMessage = e.target[0].value.trimEnd();

        if (
            file?.size === 0 &&
            file.name.length === 0 &&
            responseMessage.length === 0
        ) {
            alert('Vous ne pouvez pas envoyez de message vide');
            return;
        }

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
        } else {
            await dispatch(
                createResponseToPost({
                    subject_id: subject.id,
                    post_id: postId,
                    message: responseMessage,
                    file_id: fileId,
                } as PayLoadCreateSubjectMessage),
            );
        }
        dispatch(setCurrentSubjectDisplayWithAllRelatedData(subject.id));

        clearFile();
        formRef.current.reset();
    }

    return (
        <>
            <form ref={formRef} onSubmit={handleSubmit} className={'grid grid-cols-12 mt-10'}>
                <span className={'inline col-span-9 flex flex-col'}>
                    <textarea
                        className={
                            'w-full p-2 mt-2 border-2 border-gray-600 rounded-md'
                        }
                        rows={2}
                        cols={30}
                        placeholder={'Nouveau Message'}
                    ></textarea>
                </span>
                <span
                    className={
                        'col-start-10 col-span-3 flex flex-col justify-start items-center'
                    }
                >
                    <button
                        type={'button'}
                        className={
                            'w-12/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 rounded'
                        }
                        onClick={() => setShowPopup(true)}
                    >
                        Ajouter un fichier
                    </button>
                    {fileName && <span>{fileName}</span>}
                    <button
                        type="submit"
                        className={
                            'w-12/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                        }
                    >
                        Envoyer
                    </button>
                </span>
            </form>
            {showPopup &&
                createPortal(
                    <div className={'alertContainer'}>
                        <div className={'alertPopup text-center'}>
                            <h1>Drive</h1>
                            <DisplayFiles
                                callbackOnClick={getFileFromDrive}
                                startingFolderId={subject.folder_id}
                            />
                            <h1>
                                <input
                                    type="file"
                                    name="file"
                                    id="file"
                                    className={
                                        'w-8/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 rounded'
                                    }
                                    ref={fileRef}
                                    onChange={getFileFromComputer}
                                />
                            </h1>
                            <button
                                className={
                                    'bg-red-500 hover:bg-red-700 text-white w-1/2 mx-auto font-bold py-2 px-4 rounded'
                                }
                                onClick={quitPopup}
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
