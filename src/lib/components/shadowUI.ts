import { sliderLabel, sliderOutput, sliderRange } from '../utils/doms';
import css from '../styles/style.css' with { type: 'css' };
  
export class ShadowUI {
    #labelTitle: string = 'Color Picker';
    #labelHue: string = 'Hue';
    #labelSaturation: string = 'Saturation';
    #labelLightness: string = 'Lightness';
    #labelOpacity: string = 'Opacity';
    #labelOK: string = 'OK';

    set labelTitle(label: string) {
        this.#labelTitle = label;
    }

    set labelHue(label: string) {
        this.#labelHue = label;
    }

    set labelSaturation(label: string) {
        this.#labelSaturation = label;
    }

    set labelLightness(label: string) {
        this.#labelLightness = label;
    }

    set labelOpacity(label: string) {
        this.#labelOpacity = label;
    }

    set labelOK(label: string) {
        this.#labelOK = label;
    }


    build = (element: HTMLElement) => {
        const shadow = element.attachShadow({mode: 'open'});
        shadow.adoptedStyleSheets = [css];

        const wrapper = this.#buildDialog();
        shadow.appendChild(wrapper);

        return this.#instanciateUI(shadow);
    };

    #instanciateUI = (shadow: ShadowRoot) => {
        const UISlider = {
            hue: {
                range: shadow.querySelector('[name="hue-range"]') as HTMLInputElement,
                output: shadow.querySelector('[name="hue-output"]') as HTMLInputElement,
            },
            lightness: {
                range: shadow.querySelector('[name="lightness-range"]') as HTMLInputElement,
                output: shadow.querySelector('[name="lightness-output"]') as HTMLInputElement,
            },
            saturation: {
                range: shadow.querySelector('[name="saturation-range"]') as HTMLInputElement,
                output: shadow.querySelector('[name="saturation-output"]') as HTMLInputElement,
            },
            opacity: {
                range: shadow.querySelector('[name="opacity-range"]') as HTMLInputElement,
                output: shadow.querySelector('[name="opacity-output"]') as HTMLInputElement,
            },
        };

        return {
            dialog: shadow.querySelector('dialog') as HTMLDialogElement,
            header: shadow.querySelector('header') as HTMLElement,
            wrapper: shadow.querySelector('[part="wrapper"]') as HTMLDivElement,
            sliders: {
                wrapper: shadow.querySelector('[part="sliders"]') as HTMLInputElement,
                slider: UISlider,
            },
            hex: {
                input: shadow.querySelector('[part="hex"] input[name="hex"]') as HTMLInputElement,
                info: shadow.querySelector('[part="hex"] a') as HTMLAnchorElement,
                eyedropper: shadow.querySelector('[part="hex"] button[value="eyedropper"]') as HTMLButtonElement,
            },
            preview: {
                new: shadow.querySelector('[part="preview"] [data-id="new"]') as HTMLSpanElement,
                current: shadow.querySelector('[part="preview"] [data-id="current"]') as HTMLSpanElement,
            },
            area: {
                wrapper: shadow.querySelector('[part="area"]') as HTMLDivElement,
                cursor: shadow.querySelector('[part="area-cursor"]') as HTMLSpanElement,
            }
        };
    };

    
    #buildSlider = (params: SliderParams): HTMLDivElement => {
        const slider = document.createElement('div');
        slider.setAttribute('class', `${params.name}`);
        slider.setAttribute('part', `slider`);
        
        const label = sliderLabel(params);
        const output = sliderOutput(params);
        const range = sliderRange(params);
    
        slider.appendChild(label);
        slider.appendChild(output);
        slider.appendChild(range);
    
        return slider;
    };
    
    #buildSliders = (): HTMLDivElement => {
        const sliders = document.createElement('div');
        sliders.setAttribute('part', 'sliders');
    
        const elements: SliderParams[] = [
            {label: this.#labelHue, name: 'hue', values: {min:0, max:360}},
            {label: this.#labelSaturation, name: 'saturation', values: {min:0, max:100}},
            {label: this.#labelLightness, name: 'lightness', values: {min:0, max:100}},
            {label: this.#labelOpacity, name: 'opacity', values: {min:0, max:100}},
        ];
    
        elements.forEach(element => {
            sliders.appendChild(
                this.#buildSlider(element)
            );
        });
    
        return sliders;
    };
    
    #buildPreviewBlock = (): HTMLDivElement => {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('part', 'preview');
    
        const newColor = document.createElement('span');
        newColor.setAttribute('data-id', 'new');
    
        const currentColor = document.createElement('span');
        currentColor.setAttribute('data-id', 'current');
    
        const preview = document.createElement('div');
        preview.appendChild(newColor);
        preview.appendChild(currentColor);
    
        const confirmButton = document.createElement('button');
        confirmButton.setAttribute('part', 'confirm');
        confirmButton.setAttribute('value', 'ok');
        confirmButton.appendChild(document.createTextNode(this.#labelOK));
    
        wrapper.appendChild(preview);
        wrapper.appendChild(confirmButton);
    
        return wrapper;
    };
    
    #buildHexBlock = (): HTMLDivElement => {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('part', 'hex');
    
        const input = document.createElement('input');
        input.setAttribute('aria-label', 'Hex');
        input.setAttribute('type', 'text');
        input.setAttribute('name', 'hex');
        input.setAttribute('part', 'hex-input');
    
        wrapper.appendChild(input);
    
        if ('EyeDropper' in window) {
            const eyedropper = document.createElement('button');
            eyedropper.setAttribute('aria-label', 'EyeDropper');
            eyedropper.setAttribute('value', 'eyedropper');
            eyedropper.setAttribute('part', 'eyedropper');
            eyedropper.appendChild(document.createTextNode('EyeDropper'));
    
            wrapper.appendChild(eyedropper);
        }
    
        const info = document.createElement('a');
        info.setAttribute('href', '#');
        info.setAttribute('target', '_blank');
        info.setAttribute('part', 'info');
        info.appendChild(document.createTextNode('Info'));
    
        wrapper.appendChild(info);
    
        return wrapper;
    };
    
    #buildArea = (): HTMLDivElement => {
        const area = document.createElement('div');
        const cursor = document.createElement('span');
    
        area.setAttribute('part', 'area');
        area.setAttribute('tabindex', '0');
    
        cursor.setAttribute('data-id', 'cursor');
        cursor.setAttribute('part', 'area-cursor');
    
        area.appendChild(cursor);
    
        return area;
    };
    
    #buildWrapper = (): HTMLDivElement => {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('part', 'wrapper');
    
        const hex = this.#buildHexBlock();
        const preview = this.#buildPreviewBlock();
        const area = this.#buildArea();
        const sliders = this.#buildSliders();
    
        wrapper.appendChild(hex);
        wrapper.appendChild(preview);
        wrapper.appendChild(area);
        wrapper.appendChild(sliders);
    
        return wrapper;
    };
    
    #buildHeaderDialog = (): HTMLElement => {
        const header = document.createElement('header');
        header.setAttribute('part', 'header');
    
        const h = document.createElement('h3');
        h.appendChild(document.createTextNode(this.#labelTitle));
    
        const button = document.createElement('button');
        button.setAttribute('part', 'cancel');
        button.setAttribute('value', 'cancel');
        button.appendChild(document.createTextNode('Cancel'));
    
        header.appendChild(h);
        header.appendChild(button);
    
        return header;
    };

    #buildDialog = (): HTMLDialogElement => {
        const dialog = document.createElement('dialog');
        dialog.setAttribute('part', 'dialog');
    
        const header = this.#buildHeaderDialog();
        const wrapper = this.#buildWrapper();
    
        dialog.appendChild(header);
        dialog.appendChild(wrapper);
    
        return dialog;
    };
}