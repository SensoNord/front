import { ConversationType } from '../../../types/Chat/ConversationType';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import DisplayFiles from '../../Files/DisplayFiles';
import '../../../styles/textarea.css';
import { useAppDispatch } from '../../../App/hooks';
import {
    createMessageToConversation,
    setCurrentConversationDisplayWithAllRelatedData,
} from '../../../slicers/chat/conversation-slice';
import { PayLoadCreateConversationMessage } from '../../../slicers/chat/conversation-slice-helper';
import { useFileManagement } from '../../../customHook/useFileManagement';
import AddFilePopup from '../AddFilePopup';

type WriteMessageProps = {
    conversation: ConversationType;
};

export default function WriteMessage(props: WriteMessageProps) {
    const { conversation } = props;
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
            setUploadedFile(null);
        } else {
            await dispatch(
                createMessageToConversation({
                    conversation_id: conversation.id,
                    message: responseMessage,
                } as PayLoadCreateConversationMessage),
            );
        }
        dispatch(setCurrentConversationDisplayWithAllRelatedData(conversation.id));

        formRef.current.reset();
    }

    return (
        <>
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className={'grid grid-cols-12 bg-white pb-8 pt-6 w-full h-full'}
            >
                <span className={'inline col-span-10 flex flex-col'}>
                    <textarea
                        id={'response'}
                        placeholder={'Nouveau Message'}
                        className={'w-10/12 p-2 mt-2 mx-auto border-2 border-gray-600 rounded-md'}
                        rows={3}
                        cols={30}
                    ></textarea>
                </span>
                <span className={'inline col-start-11 col-span-2 flex flex-col justify-start items-center'}>
                    <button
                        type={'button'}
                        className={'w-8/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 rounded'}
                        onClick={() => setShowPopup(true)}
                    >
                        Ajouter un fichier
                    </button>
                    {uploadedFile?.name && (
                        <>
                            <span>Fichier : {uploadedFile?.name}</span>
                            <span>
                                Origine : {uploadedFile?.uploadOrigin === 'drive' ? 'Drive' : 'Ordinateur local'}
                            </span>
                        </>
                    )}
                    <button
                        type="submit"
                        className={'w-8/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'}
                    >
                        Envoyer
                    </button>
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
