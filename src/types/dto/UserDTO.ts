

export interface UserDTO {
    username: string;
    password: string;
    role: string;
}

export interface UserResponseDTO {
    user: { 
        id: string;
        username: string;
        role: string;
    }
    error?: string | null;
}

export interface UsersDTO {
    users: UserDTO[];
}

export interface UserResponseDTOList {
    users: UserResponseDTO[];
}
