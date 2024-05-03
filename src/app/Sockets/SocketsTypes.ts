export interface IInitUserBody{
    token: string;
    id: string
}

export interface IUserMessageBody{
    id: string;
    message: string;
    name: string;
    token: string;
}