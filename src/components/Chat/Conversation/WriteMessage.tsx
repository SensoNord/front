import { ConversationType } from '../../../types/Chat/ConversationType';
import { FC, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import DisplayFiles from '../../Files/DisplayFiles';
import folder from '../../../lib/folder';
import conversation from '../../../lib/conversation';
import '../../../styles/textarea.css';

const WriteMessage: FC<{ conv: ConversationType }> = ({ conv }) => {
    const [showPopup, setShowPopup] = useState(false);
    const fileRef = useRef(null) as { current: any };
    const [fileName, setFileName] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);

    function quitPopup() {
        setShowPopup(false);
    }

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

        if (file && !fileId) {
            const newFile = await folder.uploadFile(
                file,
                conv.folder_id,
                null,
                conv.id,
            );
            if (newFile)
                await conversation.createMessage(
                    conv.id,
                    responseMessage,
                    newFile.id,
                );
        } else {
            await conversation.createMessage(conv.id, responseMessage, fileId);
        }

        window.location.reload();
    }

    function getFileFromDrive(file: any) {
        fileRef.current.value = '';
        setFile(null);
        setFileId(file.id);
        setFileName(file.filename_download);
        setShowPopup(false);
    }

    function getFileFromComputer(e: { target: { files: any } }) {
        const f = e.target.files[0];
        setFile(f);
        setFileId(null);
        setFileName(f.name);
        setShowPopup(false);
    }

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className={'grid grid-cols-12 bg-white pb-8 pt-6 w-full h-full'}
            >
                <span className={'inline col-span-10 flex flex-col'}>
                    <textarea
                        id={'response'}
                        placeholder={'Nouveau Message'}
                        className={
                            'w-10/12 p-2 mt-2 mx-auto border-2 border-gray-100 rounded-md'
                        }
                        rows={3}
                        cols={30}
                    ></textarea>
                </span>
                <span
                    className={
                        'inline col-start-11 col-span-2 flex flex-col justify-start items-center'
                    }
                >
                    <button
                        type={'button'}
                        className={
                            'w-8/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 rounded'
                        }
                        onClick={() => setShowPopup(true)}
                    >
                        Ajouter un fichier
                    </button>
                    {fileName && <span>{fileName}</span>}
                    <button
                        type="submit"
                        className={
                            'w-8/12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
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
                                startingFolderId={conv.folder_id}
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
};

export default WriteMessage;
