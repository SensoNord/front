import { ErrorType } from '../types/Request/ErrorType';
import { StatusEnum } from '../types/Request/StatusEnum';

interface InviteState {
  invitation: InvitationType;
  status: StatusEnum
  error: ErrorType;
}
