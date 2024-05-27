import { ColorUtils } from "../utils/color";
import { clampValue, validateHex } from "../utils/validators";

export class EventHandler {
    #element: HTMLElement;
    #UI: UI;
    #hex: string = '#000000ff';
    #hexOrigin: string = '#ffffffff';
    #hsl: HslColor = {
        h: 0,
        s: 0,
        l: 0,
    };
    #hsv: HsvColor = {
        h: 0,
        s: 0,
        v: 0,
    };
    #opacity = 100;

    constructor(element: HTMLElement, UI: UI) {
        this.#element = element;
        this.#UI = UI;
    }

    open = (): void => {
        this.#UI.dialog.showModal();
        this.#updateUIArea();
    };

    close = (): void => {
        this.#UI.dialog.close();
        this.#dispatch();
    };

    handlePointerDown = (e: Event): void => {
        const target = e.target as HTMLElement;

        if (
            target.matches('[part="area"]') ||
            target.matches('[part="area-cursor"]')
        ) {
            document.addEventListener('pointermove', this.#handleDragCursor);
            e.preventDefault();

            if (!target.matches('[part="area-cursor"]')) {
                this.#handleDragCursor(e as MouseEvent);
            }
        }
    };

    handlePointerUp = (e: Event): void => {
        document.removeEventListener('pointermove', this.#handleDragCursor);
    };

    handleClick = async (e: Event): Promise<void> => {
        const target = e.target as HTMLElement;
        const button = target.closest('button');

        if(button) {
            switch (button.value) {
                case 'cancel':
                    this.#hex = this.#hexOrigin;
                    this.close();
                    return;
                case 'ok':
                    this.close();
                    return;
                case 'eyedropper':
                    await this.#handleEyeDropper(e);
                    return;
            }
        }
    };

    handleSliders = (e: Event): void => {
        const target = e.target as HTMLInputElement;

        const [name, type] = target.name.split("-");

        if (this.#UI.sliders.slider && this.#UI.sliders.slider[name]) {
            let value = target.value ? parseFloat(target.value) : 0;

            if(target.hasAttribute('min') && target.hasAttribute('max')) {
                value = clampValue(
                    value, 
                    parseInt(target.getAttribute('min') as string), 
                    parseInt(target.getAttribute('max') as string)
                );
            }

            this.#UI.sliders.slider[name].range.value = `${value}`;
            this.#UI.sliders.slider[name].output.value = `${value}`;

            this.#hsl.h = parseFloat(this.#UI.sliders.slider.hue.range.value);
            this.#hsl.s = parseFloat(this.#UI.sliders.slider.saturation.range.value);
            this.#hsl.l = parseFloat(this.#UI.sliders.slider.lightness.range.value);
            this.#opacity = parseFloat(this.#UI.sliders.slider.opacity.output.value);

            this.#updateFromSliders();
        }
    };

    handleHex = (e: Event): void => {
        const target = e.target as HTMLInputElement;

        const value = validateHex(target.value);

        if (e.type === 'focusout') {
            target.value = value;
        }

        this.#hex = value;
        this.#updateFromHex();
    };

    #handleDragCursor = (e: MouseEvent): void => {
        e.preventDefault();

        const rect = this.#UI.area.wrapper.getBoundingClientRect();

        const x = Math.min(rect.width, Math.max(0, e.clientX - rect.left));
        const y = Math.min(rect.height, Math.max(0, e.clientY - rect.top));

        this.#UI.area.cursor.style.transform = `translate3D(${x}px, ${y}px, 0)`;

        this.#hsv.h = parseFloat(this.#UI.sliders.slider.hue.range.value);
        this.#hsv.s = x / rect.width * 100;
        this.#hsv.v = (1 - y / rect.height) * 100;

        this.#updateFromArea();
    };

    #handleEyeDropper = async (e:Event): Promise<void> => {
        if ('EyeDropper' in window) {
            const eyeDropper = new EyeDropper();

            try {
                const value = await eyeDropper.open();
                this.#hex = `${value.sRGBHex}ff`;
                this.#updateFromHex(true);
            } catch (err) {
                this.#hex = `000000ff`;
            }
        }
    };

    updateFromPicker = (hex: string): void => {
        const colorUtils = new ColorUtils();
        colorUtils.fromHex(hex);

        this.#hex = colorUtils.toHex();
        this.#hsl = colorUtils.toHsl();
        this.#hsv = colorUtils.toHsv();
        this.#opacity = colorUtils.toOpacity();

        this.#updateUISliders();
        this.#updateUIHex();
        this.#updateUIArea();
        this.#updateUIPreview();

        if(this.#UI) {
            this.#hexOrigin = this.#hex;
            this.#UI.preview.current.style.setProperty('--c', `${this.#hexOrigin}`);
        }

        // this.#dispatch();
    };

    #updateFromArea = (): void => {
        const colorUtils = new ColorUtils();
        colorUtils.fromHsv(this.#hsv);
        colorUtils.setOpacity(this.#opacity);

        this.#hex = colorUtils.toHex();
        const hsl = colorUtils.toHsl();
        this.#hsl.h = this.#hsv.h;
        this.#hsl.s = hsl.s;
        this.#hsl.l = hsl.l;

        this.#updateUIHex();
        this.#updateUISliders();
        this.#updateUIPreview();
        this.#dispatch();
    };

    #updateFromSliders = (): void => {
        const colorUtils = new ColorUtils();
        colorUtils.fromHsl(this.#hsl);
        colorUtils.setOpacity(this.#opacity);

        this.#hex = colorUtils.toHex();
        this.#hsv = colorUtils.toHsv();

        this.#updateUIHex();
        this.#updateUIArea();
        this.#updateUIPreview();
        this.#dispatch();
    };

    #updateFromHex = (updateHexInput: boolean = false): void => {
        const colorUtils = new ColorUtils();
        colorUtils.fromHex(this.#hex);
        this.#hsl = colorUtils.toHsl();
        this.#hsv = colorUtils.toHsv();
        this.#opacity = colorUtils.toOpacity();

        if(updateHexInput) {
            this.#updateUIHex();
        }

        this.#updateUISliders();
        this.#updateUIArea();
        this.#updateUIPreview();
        this.#dispatch();
    };

    #updateUIHex = (): void => {
        this.#UI.hex.input.value = this.#hex;
    };

    #updateUISliders = (): void => {
        this.#UI.sliders.slider.hue.output.value = `${this.#hsl.h}`;
        this.#UI.sliders.slider.hue.range.value = `${this.#hsl.h}`;

        this.#UI.sliders.slider.saturation.output.value = `${this.#hsl.s}`;
        this.#UI.sliders.slider.saturation.range.value = `${this.#hsl.s}`;

        this.#UI.sliders.slider.lightness.output.value = `${this.#hsl.l}`;
        this.#UI.sliders.slider.lightness.range.value = `${this.#hsl.l}`;

        this.#UI.sliders.slider.opacity.output.value = `${this.#opacity}`;
        this.#UI.sliders.slider.opacity.range.value = `${this.#opacity}`;
    };
        
    #updateUIArea = (): void => {
        const rect = this.#UI.area.wrapper.getBoundingClientRect();

        const x = this.#hsv.s / 100 * rect.width,
            y = (1 - (this.#hsv.v / 100)) * rect.height;

        this.#UI.area.cursor.style.transform = `translate3D(${x}px, ${y}px, 0)`;
    };

    #updateUIPreview = (): void => {
        this.#UI.hex.info.setAttribute('href', `https://www.colorhexa.com/${this.#hex.slice(1, 7)}`);
        this.#UI.preview.new.style.setProperty('--c', `${this.#hex}`);
        this.#UI.wrapper.style.setProperty('--hue', `${this.#hsl.h}deg`);
        this.#UI.wrapper.style.setProperty('--saturation', `${this.#hsl.s}%`);
        this.#UI.wrapper.style.setProperty('--lightness', `${this.#hsl.l}%`);
        this.#UI.wrapper.style.setProperty('--opacity', `${this.#opacity}%`);
    };

    #dispatch = (): void => {
        this.#element.dispatchEvent(new CustomEvent('update-color', {
            detail: { hex: this.#hex },
            bubbles: true
        }));
    };
}