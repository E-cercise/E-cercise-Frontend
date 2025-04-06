import {EquipmentDetailResponse} from "../interfaces/equipment/EquipmentDetail.ts";
import {EquipmentFormValues} from "../interfaces/equipment/EquipmentForm.ts";
import {updateEquipment} from "../api/equipment/UpdateEquipmentDetail.ts";

export const handleUpdateSubmitPartial = async (
    equipment_id: string,
    originalData: EquipmentDetailResponse,
    values: EquipmentFormValues
) => {
    const payload: any = {};

    const basicFields: (keyof EquipmentFormValues)[] = [
        "name", "brand", "model", "color", "material", "category", "description"
    ];
    for (const field of basicFields) {
        if (values[field] !== originalData[field]) {
            payload[field] = values[field];
        }
    }

    // === Muscle Groups ===
    const originalMuscles = originalData.muscle_group_used || [];
    const currentMuscles = values.muscle_group_used || [];

    if (
        originalMuscles.length !== currentMuscles.length ||
        !originalMuscles.every(m => currentMuscles.includes(m))
    ) {
        payload.muscle_group_used = currentMuscles;
    }

    // === Additional Fields ===
    const originalAtts = originalData.additional_field || [];
    const updatedAtts = values.additional_fields || [];

    const updatedFields = updatedAtts.filter(field =>
        originalAtts.some(orig => orig.id === field.__id && (orig.key !== field.key || orig.value !== field.value))
    );
    const deletedFields = originalAtts
        .filter(orig => !updatedAtts.find(u => u.__id === orig.id))
        .map(f => f.id);
    const createdFields = updatedAtts
        .filter(field => !originalAtts.some(orig => orig.id === field.__id));

    if (updatedFields.length || deletedFields.length || createdFields.length) {
        payload.additional_field = {};
        if (updatedFields.length) {
            payload.additional_field.updated = updatedFields.map(f => ({
                id: f.__id,
                key: f.key,
                value: f.value
            }));
        }
        if (deletedFields.length) {
            payload.additional_field.deleted = deletedFields;
        }
        if (createdFields.length) {
            payload.additional_field.created = createdFields.map(f => ({
                key: f.key,
                value: f.value
            }));
        }
    }

    // === Features ===
    const updatedFeatures = values.features?.filter(f => {
        const orig = originalData.feature?.find(of => of.id === f.__id);
        return orig && orig.description !== f.description;
    }) || [];

    const deletedFeatures = (originalData.feature || []).filter(orig =>
        !values.features?.find(v => v.__id === orig.id)
    ).map(f => f.id);

    const createdFeatures = values.features?.filter(f =>
        !originalData.feature?.some(orig => orig.id === f.__id)
    ).map(f => f.description) || [];

    if (updatedFeatures.length || deletedFeatures.length || createdFeatures.length) {
        payload.feature = {};
        if (updatedFeatures.length) {
            payload.feature.updated = updatedFeatures.map(f => ({
                id: f.__id,
                description: f.description
            }));
        }
        if (deletedFeatures.length) {
            payload.feature.deleted = deletedFeatures;
        }
        if (createdFeatures.length) {
            payload.feature.created = createdFeatures;
        }
    }

    const updatedOptions = values.options?.map(opt => {
        const orig = originalData.options?.find(o => o.id === opt.__id);
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

        const galleryChanged = JSON.stringify(origGalleryIDs) !== JSON.stringify(newGalleryIDs);

        if (!baseChanged && !primaryChanged && !galleryChanged) return null;

        const deletedGallery = orig.images
            .filter(i => !i.is_primary && !newGalleryIDs.includes(i.id))
            .map(i => ({id: i.id, url: i.url, is_primary: false}));

        const uploadedGallery = (opt.galleryImages || [])
            .filter(i => !origGalleryIDs.includes(i.fileID))
            .map(i => ({id: i.fileID, is_primary: false}));

        const deletedPrimary = origPrimary && newPrimary?.fileID !== origPrimary.id
            ? [{id: origPrimary.id, url: origPrimary.url, is_primary: true}]
            : [];

        const uploadedPrimary = newPrimary?.fileID && newPrimary?.fileID !== origPrimary?.id
            ? [{id: newPrimary.fileID, is_primary: true}]
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
                ...(deleted_id.length ? {deleted_id} : {}),
                ...(upload_id.length ? {upload_id} : {})
            }
        };
    }).filter(Boolean) || [];

    const createdOptions = values.options?.filter(opt =>
        !originalData.options?.some(o => o.id === opt.__id)
    ).map(opt => {
        const mergedImages: any[] = [];

        if (opt.primaryImage) {
            mergedImages.push({
                id: opt.primaryImage.fileID,
                is_primary: true
            });
        }

        if (Array.isArray(opt.galleryImages)) {
            opt.galleryImages.forEach(img => {
                mergedImages.push({
                    id: img.fileID,
                    is_primary: false
                });
            });
        }

        return {
            name: opt.name,
            price: opt.price,
            weight: opt.weight,
            available: opt.available,
            images: mergedImages
        };
    }) || [];

    const deletedOptions = originalData.options?.filter(opt =>
        !values.options?.find(o => o.__id === opt.id)
    ).map(opt => opt.id) || [];

    if (updatedOptions.length || createdOptions.length || deletedOptions.length) {
        payload.option = {};
        if (updatedOptions.length) {
            payload.option.updated = updatedOptions;
        }
        if (createdOptions.length) {
            payload.option.created = createdOptions;
        }
        if (deletedOptions.length) {
            payload.option.deleted = deletedOptions;
        }
    }

    if (Object.keys(payload).length > 0) {
        return await updateEquipment(equipment_id, payload);
    }

    return null;
};