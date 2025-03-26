import { useState, useEffect } from "react";

export const useToggleEditing = (autoScroll: boolean = true) => {
    const [editing, setEditing] = useState(false);

    const toggleEditing = () => setEditing((prev) => !prev);
    const setEditingOff = () => setEditing(false);
    const setEditingOn = () => setEditing(true);

    useEffect(() => {
        if (editing && autoScroll) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [editing, autoScroll]);

    return { editing, toggleEditing, setEditingOn, setEditingOff };
};