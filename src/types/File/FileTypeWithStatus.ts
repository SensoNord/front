import { FileStatusEnum } from "../Request/FileStatusEnum";
import { ModifiedFileType } from "./ModifiedFileType";

export type FileTypeWithStatus = {
    file: ModifiedFileType | null;
    status: FileStatusEnum;
};
