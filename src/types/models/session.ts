export interface ISession {
  sessionId: string;
  token: string;
  active: boolean;
  users: {token: string; socketId: string}[];
  chat: {name: string; token: string; message: string;}[],
}