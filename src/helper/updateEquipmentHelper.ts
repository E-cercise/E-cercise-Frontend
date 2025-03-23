import { EquipmentDetailResponse } from "../interfaces/equipment/EquipmentDetail.ts";
import { EquipmentFormValues } from "../interfaces/equipment/EquipmentForm.ts";
import { updateEquipment } from "../api/equipment/UpdateEquipmentDetail.ts";

const areArraysEqual = (a: string[], b: string[]) => {
    return JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
};

export const handleUpdateSubmitPartial = async (
    equipment_id: string,
    originalData: EquipmentDetailResponse,
    values: EquipmentFormValues
) => {
    console.log("Original muscle group:", originalData.muscle_group_used);
    console.log("Updated muscle group:", values.muscle_group_used);

    const payload: any = {};

    // === Basic Fields Comparison ===
    const basicFields: (keyof EquipmentFormValues)[] = [
        "name", "brand", "model", "color", "material", "category", "description"
    ];

    for (const field of basicFields) {
        if (values[field] !== originalData[field]) {
            payload[field] = values[field];
        }
    }

    const originalMuscles = originalData.muscle_group_used || [];
    const currentMuscles = values.muscle_group_used || [];


    if (
        originalMuscles.length !== currentMuscles.length ||
        !originalMuscles.every(m => currentMuscles.includes(m))
    ) {
        payload.muscle_group_used = currentMuscles;
    }

    const originalAtts = originalData.additional_field || [];
    const updatedAtts = values.additional_fields || [];

    const updatedAdditionalFields = updatedAtts.filter(field => {
        const orig = originalAtts.find(f => f.id === field.__id);
        return orig && (orig.key !== field.key || orig.value !== field.value);
    });

    const deletedAtts = originalAtts
        .filter(orig => !updatedAtts.find(u => u.__id === orig.id))
        .map(d => d.id);

    if (updatedAdditionalFields.length || deletedAtts.length) {
        payload.additional_field = {
            updated: updatedAdditionalFields.length
                ? updatedAdditionalFields.map(f => ({
                    id: f.__id,
                    key: f.key,
                    value: f.value,
                }))
                : null,
            deleted: deletedAtts.length ? deletedAtts : null,
            created: null,
        };
    }

    // === Features ===
    const updatedFeatures = values.features?.filter(f => {
        const orig = originalData.feature?.find(of => of.id === f.__id);
        return orig && orig.description !== f.description;
    });

    const deletedFeatures = (originalData.feature || [])
        .filter(orig => !values.features?.find(v => v.__id === orig.id))
        .map(f => f.id);

    if ((updatedFeatures && updatedFeatures.length) || deletedFeatures.length) {
        payload.feature = {
            ...(updatedFeatures?.length
                ? {
                    updated: updatedFeatures.map(f => ({
                        id: f.__id,
                        description: f.description,
                    }))
                }
                : {}),
            ...(deletedFeatures.length ? { deleted: deletedFeatures } : {}),
        };
    }

    const updatedOptions = values.options?.map(opt => {
        const orig = originalData.option?.find(o => o.id === opt.__id);
        if (!orig) return null;

        const baseChanged =
            orig.name !== opt.name ||
            Number(orig.price) !== Number(opt.price) ||
            Number(orig.weight) !== Number(opt.weight) ||
            Number(orig.available) !== Number(opt.available);

        const origPrimary = orig.images.find(i => i.is_primary);
        const newPrimary = opt.primaryImage;

        const primaryChanged =
            (origPrimary?.id !== newPrimary?.fileID) ||
            (origPrimary?.is_primary !== newPrimary?.is_primary);

        const origGalleryIDs = orig.images.filter(i => !i.is_primary).map(i => i.id).sort();
        const newGalleryIDs = (opt.galleryImages || []).map(i => i.fileID).sort();

        const galleryChanged =
            JSON.stringify(origGalleryIDs) !== JSON.stringify(newGalleryIDs);

        if (!baseChanged && !primaryChanged && !galleryChanged) return null;

        const deletedGallery = orig.images
            .filter(i => !i.is_primary && !newGalleryIDs.includes(i.id))
            .map(i => ({ id: i.id, url: i.url, is_primary: false }));

        const uploadedGallery = (opt.galleryImages || [])
            .filter(i => !origGalleryIDs.includes(i.fileID))
            .map(i => ({ id: i.fileID, is_primary: false }));

        const deletedPrimary = origPrimary && newPrimary?.fileID !== origPrimary.id
            ? [{ id: origPrimary.id, url: origPrimary.url, is_primary: true }]
            : [];

        const uploadedPrimary = newPrimary?.fileID && newPrimary?.fileID !== origPrimary?.id
            ? [{ id: newPrimary.fileID, is_primary: true }]
            : [];

        const deleted_id = [...deletedPrimary, ...deletedGallery];
        const upload_id = [...uploadedPrimary, ...uploadedGallery];

        return {
            id: opt.__id,
            name: opt.name,
            price: opt.price,
            weight: opt.weight,
            available: opt.available,
            images: {
                ...(deleted_id.length ? { deleted_id } : {}),
                ...(upload_id.length ? { upload_id } : {}),
            }
        };
    }).filter(Boolean);

    if (updatedOptions.length > 0) {
        payload.option = { updated: updatedOptions };
    }

    // === Final clean-up ===
    if (payload.option && Object.keys(payload.option).length === 0) {
        delete payload.option;
    }
    if (payload.additional_field && Object.keys(payload.additional_field).length === 0) {
        delete payload.additional_field;
    }

    // === Only send if anything changed ===
    if (Object.keys(payload).length > 0) {
        return await updateEquipment(equipment_id, payload);
    }
};
