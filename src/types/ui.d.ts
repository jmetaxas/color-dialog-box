interface SliderParams {
    label: string,
    name: string;
    values: {
        min: number;
        max: number;
    };
}

interface UISliders {
    [key: string]: {
        range: HTMLInputElement;
        output: HTMLInputElement;
    };
}

interface UI {
    dialog: HTMLDialogElement;
    header: HTMLElement;
    wrapper: HTMLDivElement;
    sliders: {
        wrapper: HTMLDivElement;
        slider: UISliders;
    }
    hex: {
        input: HTMLInputElement;
        info: HTMLAnchorElement;
        eyedropper: HTMLButtonElement;
    },
    preview: {
        new: HTMLSpanElement;
        current: HTMLSpanElement;
    };
    area: {
        wrapper: HTMLDivElement;
        cursor: HTMLSpanElement;
    };
}