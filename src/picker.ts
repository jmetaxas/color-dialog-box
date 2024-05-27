import { EventHandler } from "./lib/events/event-handler";
import { ShadowUI } from "./lib/components/shadowUI";
import { Modal } from "./lib/events/modal-handler";

export class Picker extends HTMLElement {
    static observedAttributes = ["hex", "open"];
    #eventHandler?: EventHandler;

    constructor() {
        super();

        const shadowUI = new ShadowUI();

        this.#setAttributes(shadowUI, {
            labelTitle: this.getAttribute('label-title'),
            labelHue: this.getAttribute('label-hue'),
            labelSaturation: this.getAttribute('label-saturation'),
            labelLightness: this.getAttribute('label-lightness'),
            labelOpacity: this.getAttribute('label-opacity'),
            labelOK: this.getAttribute('label-ok'),
        });

        const UI = shadowUI.build(this);

        if(UI) {
            this.#eventHandler = new EventHandler(this, UI);
            UI.dialog.addEventListener('click', this.#eventHandler.handleClick);
            UI.sliders.wrapper.addEventListener('input', this.#eventHandler.handleSliders);
            UI.hex.input.addEventListener('input', this.#eventHandler.handleHex);
            UI.hex.input.addEventListener('focusout', this.#eventHandler.handleHex);
            UI.wrapper.addEventListener('pointerdown', this.#eventHandler.handlePointerDown);
            document.addEventListener('pointerup', this.#eventHandler.handlePointerUp);

            const modal = new Modal();
            UI.header.addEventListener('click', modal.handleOptions);
            UI.header.addEventListener('pointerdown', modal.handleStartDrag);
            document.addEventListener('pointerup', modal.handleStopDrag);
        }
    }

    // connectedCallback() {
    //     console.log("Custom element added to page.");
    // }

    // disconnectedCallback() {
    //     console.log("Custom element removed from page.");
    // }

    // adoptedCallback() {
    //     console.log("Custom element moved to new page.");
    // }

    attributeChangedCallback(
        name: string, oldValue: string, newValue: string
    ) {
        if(name === 'open' && this.#eventHandler) {
            if(newValue === 'true') {
                this.#eventHandler.open();
            }
        }

        if(name === 'hex' && this.#eventHandler) {
            newValue = newValue ? newValue : '#000000ff';
            this.#eventHandler.updateFromPicker(newValue);
        }
    }

    // open() {
    //     if(this.#eventHandler) {
    //         this.#eventHandler.open();
    //     }
    // }

    #setAttributes<T>(target: T, attributes: Partial<Record<keyof T, string | null>>) {
        Object.entries(attributes).forEach(([key, value]) => {
            if (value !== null) {
                (target as any)[key] = value;
            }
        });
    }
}