import { useEffect } from "react";
import { FormInstance } from "antd";

export const useFormAutoSync = (form: FormInstance, initialValues: any) => {
    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [form, initialValues]);
};

