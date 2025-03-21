import {EquipmentFormValues} from "../interfaces/equipment/EquipmentForm.ts";

/**
 * Example GET response shape from your API:
 * {
 *   band, color, material, model, muscle_group_used, name,
 *   option: [
 *     { id, name, available, price, weight, images: [ {id, url, is_primary }, ... ] }
 *   ],
 *   feature: [ { id, description } ],
 *   additional_field: [ { id, key, value } ],
 *   special_feature?: string
 * }
 */
export function transformGETtoForm(apiData: any): Partial<EquipmentFormValues> {
    return {
        name: apiData.name,
        brand: apiData.band, // or band => brand
        model: apiData.model,
        color: apiData.color,
        material: apiData.material,
        description: apiData.special_feature || "",
        muscle_group_used: apiData.muscle_group_used || [],
        options: (apiData.option || []).map((o: any) => ({
            id: o.id,
            name: o.name,
            price: o.price,
            weight: o.weight,
            available: o.available,
            primaryImage: (o.images || []).find((i: any) => i.is_primary) || null,
            // We can’t embed the “deletedIDs” or “addedIDs” yet – that’s only after user changes things
            galleryImages: (o.images || []).filter((i: any) => !i.is_primary).map((img: any) => ({
                fileID: img.id,
                thumbnail: img.url,
                is_primary: img.is_primary,
            })),
        })),
        features: (apiData.feature || []).map((f: any) => f.description),
        additional_fields: (apiData.additional_field || []).map((af: any) => ({
            id: af.id,
            key: af.key,
            value: af.value,
        })),
    };
}

/** Transform form back into the shape your PUT wants:
 *  {
 *    brand, color, material, model, muscle_group_used, name,
 *    option: { deleted:[], updated:[], created:[] },
 *    feature: { ... },
 *    additional_field: { ... }
 *  }
 */
export function transformFormToPUT(values: EquipmentFormValues, oldData?: any): any {
    // Example only, you decide how to build “deleted”, “created”, “updated”.
    // For images, we might read “galleryImages.final / .deletedIDs / .addedIDs”.
    // This is quite custom to your app.

    // Basic top-level
    const payload: any = {
        brand: values.brand,
        color: values.color,
        material: values.material,
        model: values.model,
        muscle_group_used: values.muscle_group_used,
        name: values.name,
    };

    // Example for “option”:
    // We'll parse each item in `values.options` to see if it has an ID (update) or no ID (create)
    // If oldData is provided, we can see which old IDs disappeared => deleted
    const oldOptions = (oldData?.option || []).map((o: any) => o.id);
    const newOptions = values.options || [];

    const updatedArr: {
        id: string; name: string; available: number; price: number; weight: number;
        // images => you'd also handle “deleted_id” vs “upload_id” from the final/addedIDs, etc.
        // example:
        images: { deleted_id: string[]; upload_id: string[]; };
    }[] = [];
    const createdArr: { name: string; available: number; price: number; weight: number; images: { deleted_id: never[]; upload_id: string[]; }; }[] = [];
    const newIDs: string[] = [];

    newOptions.forEach((opt) => {
        if (opt.id) {
            newIDs.push(opt.id);
            updatedArr.push({
                id: opt.id,
                name: opt.name,
                available: opt.available,
                price: opt.price,
                weight: opt.weight,
                // images => you'd also handle “deleted_id” vs “upload_id” from the final/addedIDs, etc.
                // example:
                images: {
                    deleted_id: opt.galleryImages && "deletedIDs" in opt.galleryImages ? opt.galleryImages.deletedIDs : [],
                    upload_id: opt.galleryImages && "addedIDs" in opt.galleryImages ? opt.galleryImages.addedIDs : [],
                },
            });
        } else {
            // no ID => new
            createdArr.push({
                name: opt.name,
                available: opt.available,
                price: opt.price,
                weight: opt.weight,
                images: {
                    deleted_id: [],
                    upload_id: opt.galleryImages && "addedIDs" in opt.galleryImages ? opt.galleryImages.addedIDs : [],
                },
            });
        }
    });

    // deleted => old IDs not in newIDs
    const deletedArr = oldOptions.filter((oid: string) => !newIDs.includes(oid));

    payload.option = {
        deleted: deletedArr,
        updated: updatedArr,
        created: createdArr,
    };

    // feature => if your form just has an array of strings, you can do something simpler
    // additional_fields => similarly
    // ...
    return payload;
}