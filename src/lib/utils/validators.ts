export const validateHex = (hex: string) => {
    let value = hex.replace(/[^a-fA-F0-9]+/g, '');
    
    if(value.length === 3) {
        value = `${value[0]}${value[0]}${value[1]}${value[1]}${value[2]}${value[2]}ff`;
    }

    value = value.padStart(6, "0").padEnd(8, 'f');

    return `#${value.slice(0, 8)}`;
};

export const clampValue = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
};