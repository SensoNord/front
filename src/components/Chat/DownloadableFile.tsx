import { FileTypeWithStatus } from "../../types/File/FileTypeWithStatus";
import { FileStatusEnum } from "../../types/Request/FileStatusEnum";

type DownloadableFileProps = {
    file: FileTypeWithStatus;
    handleDownloadFile: () => void;
}

export default function DownloadableFile(props: DownloadableFileProps) {
    const { file, handleDownloadFile } = props;
    if (file.file && file.status === FileStatusEnum.ACTIVE) {
        return (
            <button
                onClick={handleDownloadFile}
                className={'underline underline-offset-4'}
            >
                Télécharger {file.file.filename_download}
            </button>
        );
    } else if (file.status === FileStatusEnum.DELETED) {
        return (
            <p className={'text-red-500'}>
                Fichier supprimé
            </p>
        );
    }

    return null;
};