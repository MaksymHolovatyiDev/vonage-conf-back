import { Session } from 'models/session';
import { IMessageBody } from './ChatTypes';

export default class ChatServices {
  async addChatMessage(id: string,body: IMessageBody) {
   return await Session.findByIdAndUpdate(id, {$push: {chat: body}});
  }
}