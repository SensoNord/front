import { ConversationType } from '../../../types/Chat/ConversationType';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import '../../../styles/textarea.css';
import { useAppDispatch } from '../../../App/hooks';
import {
    clearCurrentConversationDisplayWithAllRelatedData,
    createMessageToConversation,
    fetchConversationByIdAndPage,
} from '../../../slicers/chat/conversation-slice';
import {
    PayLoadCreateConversationMessage,
    PayloadFetchConversationByIdAndPage,
} from '../../../slicers/chat/conversation-slice-helper';
import { useFileManagement } from '../../../customHook/useFileManagement';
import AddFilePopup from '../AddFilePopup';
import { DocumentPlusIcon, PaperAirplaneIcon, TrashIcon } from '@heroicons/react/24/outline';

type WriteMessageProps = {
    conversation: ConversationType;
    pageNb: number;
};

export default function WriteMessage(props: WriteMessageProps) {
    const { conversation, pageNb } = props;
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
        chat: conversation,
        chatType: 'conversation',
    });

    const updateConversation = async () => {
        dispatch(clearCurrentConversationDisplayWithAllRelatedData());
        for (let i = 1; i <= pageNb; i++) {
            await dispatch(
                fetchConversationByIdAndPage({
                    conversationId: conversation?.id,
                    page: i,
                } as PayloadFetchConversationByIdAndPage),
            );
        }
    };

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
                    createMessageToConversation({
                        conversation_id: conversation.id,
                        message: responseMessage,
                        fileId: createdFile.id,
                    } as PayLoadCreateConversationMessage),
                );
            }
        } else {
            await dispatch(
                createMessageToConversation({
                    conversation_id: conversation.id,
                    message: responseMessage,
                } as PayLoadCreateConversationMessage),
            );
        }

        await updateConversation();
        setUploadedFile(null);
        if (formRef.current) formRef.current.reset();
    }

    return (
        <>
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className={'grid grid-cols-12 bg-white pb-8 pt-6 w-full h-full'}
            >
                <span className={'col-span-9 flex flex-col pl-16'}>
                    <textarea
                        id={'response'}
                        placeholder={'Nouveau Message'}
                        className={'w-full p-2 mt-2 border border-gray-700 rounded-md'}
                        rows={3}
                        cols={30}
                    ></textarea>
                </span>
                <span className={'col-span-3 flex flex-col justify-start items-center'}>
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
                        folderId={conversation.folder_id}
                        fileRef={fileRef}
                        getFileFromComputer={getFileFromComputer}
                        quitPopup={quitPopup}
                    />,
                    document.getElementById('modal-root') as HTMLElement,
                )}
        </>
    );
}
