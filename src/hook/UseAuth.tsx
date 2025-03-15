import {useContext} from "react";
import {AuthContext} from "../components/context/AuthContext.tsx";
import {AuthContextProps} from "../interfaces/Context.ts";

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
