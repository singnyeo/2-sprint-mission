import { Server } from "socket.io";

export function setupNotificationSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId: number) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room`);
    });
  });
}

export function emitNotification(io: Server, receiverId: number, notification: any) {
  io.to(`user_${receiverId}`).emit("newNotification", notification);
}
