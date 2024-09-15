import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import { Socket, Server } from 'socket.io';

@WebSocketGateway(3002, {cors: {origin: '*' }})
export class ChatGateWay implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    handleConnection(client: Socket) {
        console.log("new user connected..", client.id);

        client.broadcast.emit('user-joined',{
            message: `New user Joined the chat: ${client.id}`
        })

        this.server.emit('user-joined', {
            message: `New User Joined the chat: ${client.id}`
        })
    }


    handleDisconnect(client: Socket) {
        console.log("user disconected..", client.id);
        this.server.emit('user-left', {
            message: `User Left the chat: ${client.id}`
        })
    }
    @SubscribeMessage('newMessage')
    handleNewMessage(@MessageBody() message: string) {
        this.server.emit("message", message);
    }
}