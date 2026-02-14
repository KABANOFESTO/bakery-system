export interface User {
    id?: string;
    email: string;
    password: string;
    role?: string;
    username?: string | null;
    profilePicture?: string | null;
    createdAt?: Date;
    updatedAt?: Date | null;
}

export interface CreateUserDTO {
    email: string;
    password: string;
    role: string;
}

export interface GetUserDTO {
    id: string;
    email: string;
    role: string;
    username?: string | null;
    profilePicture?: string | null;
    createdAt: Date;
}

export interface UpdateProfileDTO {
    username?: string;
    profilePicture?: string;
}

const userDTO = {
    createUserDTO: (user: User): CreateUserDTO => ({
        email: user.email,
        password: user.password,
        role: user.role || 'user',
    }),

    getUserDTO: (user: User): GetUserDTO => ({
        id: user.id!,
        email: user.email,
        role: user.role!,
        username: user.username || null,
        profilePicture: user.profilePicture || null,
        createdAt: user.createdAt!,
    }),

    getUpdateProfileDTO: (data: UpdateProfileDTO): UpdateProfileDTO => ({
        username: data.username,
        profilePicture: data.profilePicture,
    })
};

export default userDTO;