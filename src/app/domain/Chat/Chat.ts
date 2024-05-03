import {
    Body,
    JsonController,
    Param,
    Post,
  } from 'routing-controllers';
  
import { IMessageBody } from './ChatTypes';
  
  @JsonController('/chat')
  export default class Chat {
    public services = new ChatServices();
  
    @Post("/:id")
    async createSession(@Param('id') id:string,@Body() body: IMessageBody) {
      return await this.services.getSession(id, body);
    }
  }