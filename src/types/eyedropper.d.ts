interface EyeDropper {
    open: () => Promise<EyeDropperResult>;
}

interface EyeDropperResult {
    sRGBHex: string;
}

declare const EyeDropper: {
    prototype: EyeDropper;
    new(): EyeDropper;
};