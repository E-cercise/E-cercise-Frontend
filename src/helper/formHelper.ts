import { FormInstance } from "antd";

/**
 * Returns only the changed fields between form and initial values.
 * For arrays, returns full updated array if different.
 */
export const getChangedFields = (
    form: FormInstance,
    initialValues: Record<string, any>
): Record<string, any> => {
    const changedFields: Record<string, any> = {};
    const keys = Object.keys(initialValues || {});

    keys.forEach((key) => {
        const current = form.getFieldValue(key);
        const initial = initialValues[key];

        const bothArrays = Array.isArray(current) && Array.isArray(initial);
        if (bothArrays) {
            const arraysEqual =
                current.length === initial.length &&
                current.every((v: any, i: number) => v === initial[i]);

            if (!arraysEqual) {
                changedFields[key] = current;
            }
        } else if (current !== initial) {
            changedFields[key] = current;
        }
    });

    return changedFields;
};
