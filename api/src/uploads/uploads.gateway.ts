import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class UploadsGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, string>();

  handleConnection(client: Socket) {
    try {
      const panel = client.handshake.headers['x-panel-role'];
      if (!panel) {
        client.disconnect();
        return;
      }

    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.clients.forEach((socketId, uploadId) => {
      if (socketId === client.id) {
        this.clients.delete(uploadId);
      }
    });
  }

  @SubscribeMessage('join-upload')
  handleJoin(client: Socket, uploadId: string) {
    this.clients.set(uploadId, client.id);
  }

  emitProgress(uploadId: string, progress: number, videoUrl?: string) {
    const socketId = this.clients.get(uploadId);
    if (!socketId) return;

    this.server.to(socketId).emit('upload-progress', {
      progress,
      videoUrl,
    });
  }
}
