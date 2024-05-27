export class ColorUtils {
    #hex?: string;
    #hexInt: number = 0;
    #opacity: number = 100;

    #rgb?: RgbColor;
    #hsl?: HslColor;
    #hsv?: HsvColor;

    fromHex(hex: string) {
        this.#hexInt = this.#hexToHexInt(hex);
    };

    fromHsl(hsl: HslColor) {
        this.#hexInt = this.#rgbToHexInt(this.#hslToRgb(hsl));
    };

    fromHsv(hsv: HsvColor) {
        this.#hexInt = this.#rgbToHexInt(this.#hslToRgb(this.#hsvToHsl(hsv)));
    };

    setOpacity(opacity: number) {
        this.#opacity = opacity;
    };

    toHex(): string {
        return this.#hex =
            this.#hex ? this.#hex : this.#hexIntToStr(this.#hexInt);
    };

    toOpacity(): number {
        return this.#opacityHexToInt(this.toHex().slice(7, 9));
    };

    toRgb(): RgbColor {
        return this.#rgb =
            this.#rgb ? this.#rgb : this.#hexToRgb(this.#hexInt);
    }

    toHsv(): HsvColor {
        return this.#hsv =
            this.#hsv ? this.#hsv : this.#rgbToHsv(this.toRgb());
    }

    toHsl(): HslColor {
        return this.#hsl =
            this.#hsl ? this.#hsl : this.#hsvToHsl(this.toHsv());
    }

    // ***** From Hex ***** //

    #hexToHexInt = (hex: string): number => {
        if(hex.charAt(0) === "#") {
            hex = hex.substring(1);
        }

        if (hex.length === 8) {
            this.#opacity = this.#opacityHexToInt(hex.slice(6, 8));
            hex = hex.slice(0, 6);
        }

        return parseInt(hex, 16);
    };

    #hexToRgb = (hexInt: number): RgbColor => {
        return {
            r: 0xff & (hexInt >> 16), 
            g: 0xff & (hexInt >> 8), 
            b: 0xff & hexInt
        };
    };

    #hexIntToStr = (hex: number): string => {
        const hexStr = "#"+hex.toString(16).padStart(6, "0");
        return `${hexStr}${this.#opacityIntToHex(this.#opacity)}`;
    }


    // ***** From RGB ***** //

    #rgbToHexInt = (rgb: RgbColor): number => {
        return (rgb.r << 16) | (rgb.g << 8) | rgb.b;
    }


    #rgbToHsv = (rgb: RgbColor): HsvColor => {
        const {r, g, b} = {r: rgb.r / 0xff, g: rgb.g / 0xff, b: rgb.b / 0xff};

        let v= Math.max(r, g, b),
            c= v-Math.min(r, g, b);
        let h= c && (
            (v === r) ? (g-b)/c : (
                (v === g) ? 2+(b-r)/c : 4+(r-g)/c
            )
        );

        return {
            h: Math.round(60*(h<0?h+6:h)),
            s: Math.round(v&&c/v*100),
            v: Math.round(v*100)
        };
    };

    // ***** From HSV ***** //

    #hsvToHsl = (hsv: HsvColor): HslColor => {
        return this.#normalizedHsvToHsl(hsv.h, hsv.s/100, hsv.v/100);
    }

    #normalizedHsvToHsl = (h: number, s: number, v: number, l = v-v*s/2, m = Math.min(l, 1-l)): HslColor => {
        return {
            h: h, 
            s: m ? Math.round((v-l)/m*100) : 0, 
            l: Math.round(l*100)
        };
    };
        


    // ***** From HSL ***** //

    #hslToRgb = (hsl: HslColor): RgbColor => {
        return this.#normalizedHslToRgb(hsl.h, hsl.s/100, hsl.l/100);
    };

    #normalizedHslToRgb = (h: number, s: number, l: number, a = s * Math.min(l, 1-l)): RgbColor => {
        const f = (n: number, k=(n+h/30)%12) =>
            l - a * Math.max(Math.min(k-3, 9-k, 1), -1);

        return {
            r: Math.round(f(0)*255),
            g: Math.round(f(8)*255),
            b: Math.round(f(4)*255)
        }
    };

    // **** Opacity **** //
    #opacityIntToHex = (a: number): string =>
        Math.round(a/100 * 0xff).toString(16).padStart(2, "0");

    #opacityHexToInt = (a: string): number =>
        Math.round(parseInt(a, 16) / 0xff * 100);
}