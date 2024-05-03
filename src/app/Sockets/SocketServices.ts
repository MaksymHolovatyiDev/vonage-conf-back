import { Session } from 'models/session';
import { IInitUserBody, IUserMessageBody } from "./SocketsTypes";
import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export default class SocketServices {
    async initUser(socketId: any, body: IInitUserBody) {
     if(body?.id && body?.token)   
       await Session.findByIdAndUpdate(body?.id, {$push: {users: {socketId, token: body.token}}});
    }

    async sendMessageUser(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,body: IUserMessageBody) {
        if(body?.id){
            const message = {
                name: body?.name,
                token: body?.token,
                message: body?.message
            }
            

            const session = await Session.findByIdAndUpdate(body?.id, {$push: {chat: message}});
            session?.users.forEach(el=>{
                io.to(el.socketId).emit('message', message);
            })
        }   
    }
  }