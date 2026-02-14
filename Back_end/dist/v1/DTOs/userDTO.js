"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userDTO = {
    createUserDTO: (user) => ({
        email: user.email,
        password: user.password,
        role: user.role || 'user',
    }),
    getUserDTO: (user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username || null,
        profilePicture: user.profilePicture || null,
        createdAt: user.createdAt,
    }),
    getUpdateProfileDTO: (data) => ({
        username: data.username,
        profilePicture: data.profilePicture,
    })
};
exports.default = userDTO;
//# sourceMappingURL=userDTO.js.map