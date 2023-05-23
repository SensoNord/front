import {useRef, useState} from 'react';
import {UpdateFilePayload, createFile, updateFile, fetchFileById, downloadFileWithoutURL} from '../slicers/file/file-slice';
import {ModifiedFileType} from '../types/File/ModifiedFileType';
import {useAppDispatch} from '../App/hooks';
import {SubjectType} from '../types/Chat/SubjectType';
import {ConversationType} from '../types/Chat/ConversationType';

type UploadedFile = {
    file: ModifiedFileType | File;
    uploadOrigin: 'computer' | 'drive';
    name: string;
};

type useFileManagementProps = {
    chat: SubjectType | ConversationType;
    chatType: 'subject' | 'conversation';
};

export const useFileManagement = (props: useFileManagementProps) => {
    const {chat, chatType} = props;
    const fileRef = useRef(null) as { current: any };
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

    async function handleFileUpload() {
        const uploadFile = async (file: File): Promise<ModifiedFileType | null> => {
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
            setUploadedFile(null);
            return createdFile;
        }

        if (uploadedFile) {
            if (uploadedFile.uploadOrigin === 'computer') {
                return await uploadFile(uploadedFile.file as File);
            } else if (uploadedFile.uploadOrigin === 'drive') {
                const f = uploadedFile.file as ModifiedFileType;
                const existingFile = (await dispatch(fetchFileById(f.id))).payload as ModifiedFileType;
                if (existingFile)
                    if (existingFile.folder !== chat.folder_id) {
                        const downloadedFile = (await dispatch(downloadFileWithoutURL(existingFile))).payload as File;
                        if (downloadedFile) {
                            return await uploadFile(downloadedFile);
                        }
                    } else {
                        return existingFile;
                    }
            }

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

    function quitPopup() {
        setShowPopup(false);
    }

    return {
        fileRef,
        uploadedFile,
        setUploadedFile,
        handleFileUpload,
        getFileFromDrive,
        getFileFromComputer,
        showPopup,
        setShowPopup,
        quitPopup,
    };
};
