import { useEffect, useContext } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export const useUnsavedChangesWarning = (when: boolean, message: string) => {
    const navigator = useContext(NavigationContext).navigator;

    useEffect(() => {
        if (!when) return;

        const originalPush = navigator.push;

        // Fix: define push with proper args
        const customPush = (...args: Parameters<typeof originalPush>) => {
            const confirmLeave = window.confirm(message);
            if (confirmLeave) {
                navigator.push = originalPush;
                originalPush(...args);
            }
        };

        navigator.push = customPush;

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = message;
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            navigator.push = originalPush;
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [when, message, navigator]);
};
