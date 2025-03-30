import { useState } from 'react';
import {checkUserEmailExist} from "../api/user_profile/CheckUserEmailExists.ts";

export function useEmailValidator(initialValue = '') {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState<string | null>(null);
    const [checking, setChecking] = useState(false);

    const onChange = (val: string) => {
        setValue(val);
        setError(null); // Clear on typing
    };

    const onBlur = async () => {
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setError('Invalid email format');
            return;
        }

        setChecking(true);
        try {
            const exists = await checkUserEmailExist(value);
            setError(exists ? 'Email already registered' : null);
        } catch {
            setError('Failed to validate email');
        } finally {
            setChecking(false);
        }
    };

    return {
        value,
        onChange,
        onBlur,
        error,
        checking,
    };
}
