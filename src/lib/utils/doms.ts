export const sliderLabel = (params: SliderParams): HTMLSpanElement => {
    const label = document.createElement('span');
    label.appendChild(document.createTextNode(params.label));
   
    return label;
};

export const sliderOutput = (params: SliderParams): HTMLInputElement => {
    const input = document.createElement('input');
    input.setAttribute('aria-label', `${params.label} output`);
    input.setAttribute('type', 'number');
    input.setAttribute('name', `${params.name}-output`);
    input.setAttribute('min', `${params.values.min}`);
    input.setAttribute('max', `${params.values.max}`);
    input.setAttribute('steps', '1');
    input.setAttribute('value', '0');
    
    return input;
};

export const sliderRange = (params: SliderParams): HTMLInputElement => {
    const input = document.createElement('input');
    input.setAttribute('aria-label', `${params.label} slider`);
    input.setAttribute('type', 'range');
    input.setAttribute('name', `${params.name}-range`);
    input.setAttribute('min', `${params.values.min}`);
    input.setAttribute('max', `${params.values.max}`);
    input.setAttribute('value', '0');

    return input;
};