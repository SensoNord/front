export type UserType = {
    first_name: string;
    last_name: string;
    id: string;
    role: string;
}

const emptyUser: UserType = {
    first_name: "",
    last_name: "",
    id: "",
    role: ""
}

export {emptyUser};
