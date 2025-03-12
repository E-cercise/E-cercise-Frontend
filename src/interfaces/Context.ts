export interface JwtPayload {
    exp: number;
    name: string;
    role: string;
    user_id: string;
}

export interface AuthContextProps {
    isLoading: boolean;
    role: string | null;
    userId: string | null;
    name: string | null;
    login: (token: string) => void;
    logout: () => void;
}
