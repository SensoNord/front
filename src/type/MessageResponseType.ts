import {UserType, emptyUser} from "./UserType";

export type MessageResponseType = {
    user_created: UserType;
    date_created: Date;
    user_updated: UserType;
    date_updated: Date;
    message: string;
}

const emptyMessageResponse: MessageResponseType = {
    user_created: emptyUser,
    date_created: new Date(),
    user_updated: emptyUser,
    date_updated: new Date(),
    message: ""
}

export {emptyMessageResponse};
