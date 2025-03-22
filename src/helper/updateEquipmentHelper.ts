import {EquipmentDetailResponse} from "../interfaces/equipment/EquipmentDetail.ts";
import {EquipmentFormValues} from "../interfaces/equipment/EquipmentForm.ts";
import {notification} from "antd";
import {updateEquipment} from "../api/equipment/UpdateEquipmentDetail.ts";

export async function handleUpdateSubmitPartial(
    equipment_id: string,
    originalData: EquipmentDetailResponse,
    newValues: EquipmentFormValues
) {
    if (!originalData) return;

    // This "putPayload" will only contain fields that changed, in the format your backend wants
    const putPayload: Record<string, any> = {};

    // ----- 1) Simple top-level fields -----
    // If your backend says "send only changed fields," we do comparisons:
    if (newValues.name !== originalData.name) {
        putPayload.name = newValues.name;
    }
    if (newValues.brand !== originalData.brand) {
        putPayload.brand = newValues.brand;
    }
    if (newValues.model !== originalData.model) {
        putPayload.model = newValues.model;
    }
    if (newValues.color !== originalData.color) {
        putPayload.color = newValues.color;
    }
    if (newValues.material !== originalData.material) {
        putPayload.material = newValues.material;
    }
    // If your originalData has no "category" or "description" in the update schema,
    // but you do want them if changed, do the same pattern:
    // if (newValues.category !== originalData.category) putPayload.category = newValues.category;
    // if (newValues.description !== originalData.description) putPayload.description = newValues.description;

    // Check muscle groups
    // A quick way is to see if arrays differ by length or content:
    const sameMuscles =
        newValues.muscle_group_used.length === originalData.muscle_group_used.length &&
        newValues.muscle_group_used.every((m) => originalData.muscle_group_used.includes(m));
    if (!sameMuscles) {
        putPayload.muscle_group_used = newValues.muscle_group_used;
    }

    // ----- 2) Build partial "option" update only if needed -----
    // Let's see if there's any difference in "options" at all
    const optionPayload = buildOptionDiff(originalData, newValues);
    // if none are created/updated/deleted => skip adding "option" to putPayload
    if (
        optionPayload.deleted.length > 0 ||
        optionPayload.updated.length > 0 ||
        optionPayload.created.length > 0
    ) {
        putPayload.option = optionPayload;
    }

    // ----- 3) Build partial "feature" update only if needed -----
    // If your server requires the object shape with { created, updated, deleted }, do the diff
    const featurePayload = buildFeatureDiff(originalData, newValues);
    if (
        featurePayload.deleted.length > 0 ||
        featurePayload.updated.length > 0 ||
        featurePayload.created.length > 0
    ) {
        putPayload.feature = featurePayload;
    }

    // ----- 4) Build partial "additional_field" update only if needed -----
    const afPayload = buildAdditionalFieldDiff(originalData, newValues);
    if (
        afPayload.deleted.length > 0 ||
        afPayload.updated.length > 0 ||
        afPayload.created.length > 0
    ) {
        putPayload.additional_field = afPayload;
    }

    // If putPayload ends up empty, it means the user changed nothing
    if (Object.keys(putPayload).length === 0) {
        notification.info({ message: "No changes detected" });
        return;
    }

    try {
        await updateEquipment(equipment_id, putPayload);
        notification.success({ message: "Success", description: "Equipment updated!" });
    } catch (err) {
        console.error(err);
        notification.error({ message: "Error", description: "Update failed." });
    }
}

function buildOptionDiff(
    originalData: EquipmentDetailResponse,
    newValues: EquipmentFormValues
): {
    deleted: string[];
    updated: any[];
    created: any[];
} {
    const oldOptions = originalData.option || [];
    const newOptions = newValues.options || [];

    const oldOptionIds = oldOptions.map((o) => o.id);
    const created: any[] = [];
    const updated: any[] = [];
    const newOptionIds: string[] = [];

    newOptions.forEach((opt) => {
        // If there's no "opt.__id," it's newly created
        const oldOpt = oldOptions.find((o) => o.id === opt.__id);
        if (!oldOpt) {
            // new
            created.push({
                name: opt.name,
                price: opt.price,
                weight: opt.weight,
                available: opt.available,
                images: transformImagesToImagePut(opt, null /* no old images to remove */),
            });
        } else {
            // existing => check if anything changed
            // (You might do a deeper check if you only want to update if changed. Or just assume changed.)
            updated.push({
                id: oldOpt.id,
                name: opt.name,
                price: opt.price,
                weight: opt.weight,
                available: opt.available,
                images: transformImagesToImagePut(opt, oldOpt.images),
            });
            newOptionIds.push(oldOpt.id);
        }
    });

    const deleted = oldOptionIds.filter((oldId) => !newOptionIds.includes(oldId));

    return { deleted, updated, created };
}

function transformImagesToImagePut(
    newOpt: EquipmentFormValues["options"][number],
    oldImages: any[] | undefined
): any {
    // If the user didn't change images, you might omit this entire field
    // But let's build it fully to illustrate:
    const newImageSet: Array<{ id: string; is_primary: boolean }> = [];

    // Gather new images
    if (newOpt.primaryImage) {
        newImageSet.push({
            id: newOpt.primaryImage.fileID,
            is_primary: true,
        });
    }
    if (Array.isArray(newOpt.galleryImages)) {
        newOpt.galleryImages.forEach((g) => {
            newImageSet.push({
                id: g.fileID,
                is_primary: false,
            });
        });
    }

    if (!oldImages) {
        // If there's no old images, everything is "upload_id"
        return {
            deleted_id: [],
            upload_id: newImageSet,
        };
    } else {
        // Build "deleted_id" vs "upload_id"
        const oldIds = oldImages.map((img) => img.id);
        const newIds = newImageSet.map((img) => img.id);

        const deleted_id = oldImages.filter((img) => !newIds.includes(img.id));
        // For newly added or changed images
        const upload_id = newImageSet.filter((ni) => !oldIds.includes(ni.id));

        // If the user changed is_primary status, that's trickier — you might treat that as updated or just re-upload.
        return {
            deleted_id,
            upload_id,
        };
    }
}

function buildFeatureDiff(
    originalData: EquipmentDetailResponse,
    newValues: EquipmentFormValues
) {
    const oldFeatures = originalData.feature || [];
    // oldFeatures: [ { id: "abc-123", description: "..." }, ... ]
    const newFeatures = newValues.features || [];
    // newFeatures: [ { __id: "...", description: "..." }, { description: "new" } ]

    const oldFeatureMap = new Map<string, { id: string; description: string }>();
    oldFeatures.forEach((f) => oldFeatureMap.set(f.id, f));

    const created: string[] = [];
    const updated: Array<{ id: string; description: string }> = [];
    const keptIds: string[] = [];

    newFeatures.forEach((nf) => {
        if (!nf.__id) {
            // new feature
            created.push(nf.description);
        } else {
            // possibly updated
            keptIds.push(nf.__id);
            const oldF = oldFeatureMap.get(nf.__id);
            if (oldF && oldF.description !== nf.description) {
                updated.push({ id: nf.__id, description: nf.description });
            }
        }
    });

    const oldIds = oldFeatures.map((f) => f.id);
    const deleted = oldIds.filter((id) => !keptIds.includes(id));

    return { created, updated, deleted };
}

function buildAdditionalFieldDiff(
    originalData: EquipmentDetailResponse,
    newValues: EquipmentFormValues
) {
    const oldAF = originalData.additional_field || [];
    // oldAF: [ { id: "...", key: "x", value: "y" }, ... ]
    const newAF = newValues.additional_fields || [];
    // newAF: [ { __id: "...", key: "x", value: "y" }, { key: "y", value: "z" } ]

    const oldAFIds = oldAF.map((x) => x.id);
    const created: any[] = [];
    const updated: any[] = [];
    const newAFIds: string[] = [];

    newAF.forEach((field) => {
        if (!field.__id) {
            // newly created
            created.push({ key: field.key, value: field.value });
        } else {
            // existing => possibly updated
            updated.push({
                id: field.__id,
                key: field.key,
                value: field.value,
            });
            newAFIds.push(field.__id);
        }
    });

    const deleted = oldAFIds.filter((id) => !newAFIds.includes(id));

    return { created, updated, deleted };
}