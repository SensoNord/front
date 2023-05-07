import { ErrorType } from "../types/Request/ErrorType";
import { StatusEnum } from "../types/Request/StatusEnum";


interface InviteState {
    status: StatusEnum;
    error: ErrorType;
}