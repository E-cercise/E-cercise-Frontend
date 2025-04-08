export const splitString = (equipmentName: string) => {
    if (equipmentName.includes(" - ")) {
        return equipmentName.split(" - ");
    } else if (equipmentName.includes(", ")) {
        return equipmentName.split(", ");
    }
    return [equipmentName];
};