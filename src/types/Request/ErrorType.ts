export type ErrorType = {
    error: string;
    status: number;
};

export function isErrorType(obj: any): obj is ErrorType {
    return obj && obj.error !== undefined && obj.status !== undefined;
}
