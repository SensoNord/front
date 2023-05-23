// useFileManagement.js
import { useRef, useState } from 'react';
import { UpdateFilePayload, createFile, updateFile } from '../slicers/file/file-slice';
import { ModifiedFileType } from '../types/File/ModifiedFileType';
import { useAppDispatch } from '../App/hooks';
import { SubjectType } from '../types/Chat/SubjectType';
import { ConversationType } from '../types/Chat/ConversationType';

type useFileManagementProps = {
    chat: SubjectType | ConversationType;
    chatType: 'subject' | 'conversation';
};

export const useFileManagement = (props: useFileManagementProps) => {
    const { chat, chatType } = props;
    const fileRef = useRef(null) as { current: any };
    const [fileName, setFileName] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    async function handleFileUpload() {
        if (file && !fileId) {
            const createdFilePayload = await dispatch(createFile(file));
            const createdFile = createdFilePayload.payload as ModifiedFileType;
            await dispatch(
                updateFile({
                    file: createdFile,
                    chatId: chat.id,
                    folderId: chat.folder_id,
                    chatType: chatType,
                } as UpdateFilePayload),
            );
            return createdFile;
        }
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

    function clearFile() {
        setFile(null);
        setFileId(null);
        setFileName(null);
    }

    function quitPopup() {
        setShowPopup(false);
    }

    return {
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
    };
};
