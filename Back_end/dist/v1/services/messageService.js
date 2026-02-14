"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const toMessageDTO = (message) => {
    return {
        id: message.id,
        name: message.name,
        email: message.email,
        description: message.description,
        createdAt: message.createdAt
    };
};
const messageService = {
    createMessage: async (messageData) => {
        const message = await database_1.prisma.message.create({
            data: messageData,
        });
        return toMessageDTO(message);
    },
    getAllMessages: async () => {
        const messages = await database_1.prisma.message.findMany();
        return messages.map(toMessageDTO);
    },
    getMessageById: async (id) => {
        const message = await database_1.prisma.message.findUnique({
            where: { id }
        });
        return message ? toMessageDTO(message) : null;
    },
    deleteMessage: async (id) => {
        await database_1.prisma.message.delete({ where: { id } });
    },
    updateMessage: async (id, messageData) => {
        const updatedMessage = await database_1.prisma.message.update({
            where: { id },
            data: messageData,
        });
        return toMessageDTO(updatedMessage);
    }
};
exports.default = messageService;
//# sourceMappingURL=messageService.js.map