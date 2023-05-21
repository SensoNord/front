import { FileTypeWithStatus } from "../types/File/FileTypeWithStatus";
import { fetchFileById } from "../slicers/file/file-slice";
import { useAppDispatch } from "../App/hooks";
import { ModifiedFileType } from "../types/File/ModifiedFileType";
import { ErrorType, isErrorType } from "../types/Request/ErrorType";
import { FileStatusEnum } from "../types/Request/FileStatusEnum";
import { useEffect } from "react";

type Props = {
    setFile: React.Dispatch<React.SetStateAction<FileTypeWithStatus>>;
    file_id: string;
};

export async function useFetchFile(props: Props) {
    const { setFile, file_id } = props;
    const dispatch = useAppDispatch();

    useEffect(() => {
      async function fetchFile() {
        if (file_id) {
          let filesPayload = await dispatch(fetchFileById(file_id));
          let files = filesPayload.payload as ModifiedFileType | ErrorType;
  
          if (isErrorType(files)) {
            setFile({
              file: null,
              status: FileStatusEnum.DELETED,
            } as FileTypeWithStatus);
          } else {
            setFile({
              file: files,
              status: FileStatusEnum.ACTIVE,
            } as FileTypeWithStatus);
          }
        } else {
          setFile({
            file: null,
            status: FileStatusEnum.NULL,
          } as FileTypeWithStatus);
        }
      }
  
      fetchFile();
    }, [dispatch, file_id, setFile]);
  }  