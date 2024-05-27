import { expect } from '@esm-bundle/chai';
import { fixture, html } from '@open-wc/testing-helpers';
import sinon from 'sinon';

import '../src/index.ts';
import type { Picker } from 'src/picker';

describe('color-picker', () => {
    let picker: Picker;

    describe('default', () => {
        beforeEach(async () => {
            picker = await fixture(html`<color-picker></color-picker>`);
        });

        it('should render correctly', () => {
            const shadowRoot = picker.shadowRoot;
            expect(shadowRoot).to.exist;
            const dialog = shadowRoot?.querySelector('dialog');
            expect(dialog).to.exist;
        });
    });

    describe('attributeChangedCallback', () => {     
        it('should display the correct hex color when the "hex" attribute is set', async () => {
            picker = await fixture(html`<color-picker></color-picker>`);
            picker.setAttribute('hex', '#ff0000ff');

            const colorPreview = picker.shadowRoot?.querySelector('[part="preview"] [data-id="current"]') as HTMLElement;
            expect(colorPreview?.style.getPropertyValue('--c')).to.equal('#ff0000ff');
        });

        it('should display a default #000000ff hex color', async () => {
            picker = await fixture(html`<color-picker></color-picker>`);
            picker.setAttribute('hex', '');

            const colorPreview = picker.shadowRoot?.querySelector('[part="preview"] [data-id="current"]') as HTMLElement;
            expect(colorPreview?.style.getPropertyValue('--c')).to.equal('#000000ff');
        });

        it('should display the custom labels', async () => {
            picker = await fixture(html`<color-picker label-title="title" label-hue="h" label-saturation="s" label-lightness="l" label-opacity="o" label-ok="v"></color-picker>`);

            const shadow = picker.shadowRoot;
            const title = shadow?.querySelector('[part="header"] h3') as HTMLElement;
            const ok = shadow?.querySelector('[part="confirm"]') as HTMLElement;
            const h = shadow?.querySelector('[part="sliders"] .hue > span') as HTMLElement;
            const s = shadow?.querySelector('[part="sliders"] .saturation > span') as HTMLElement;
            const l = shadow?.querySelector('[part="sliders"] .lightness > span') as HTMLElement;
            const o = shadow?.querySelector('[part="sliders"] .opacity > span') as HTMLElement;

            expect(title.innerText).to.equal('title');
            expect(ok.innerText).to.equal('v');
            expect(h.innerText).to.equal('h');
            expect(s.innerText).to.equal('s');
            expect(l.innerText).to.equal('l');
            expect(o.innerText).to.equal('o');
        });

        it('should display the dialog when the "open" attribute is set', async () => {
            picker = await fixture(html`<color-picker></color-picker>`);
            picker.setAttribute('open', 'true');

            const dialog = picker.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
            expect(dialog.open).to.equal(true);
        });
    });
    

    describe('Buttons', () => {
        beforeEach(async () => {
            picker = await fixture(html`<color-picker></color-picker>`);
            picker.setAttribute('open', 'true');
        });
    
        it('should close the dialog when the close button is clicked', async () => {
            const button = picker.shadowRoot?.querySelector('[part="cancel"]') as HTMLButtonElement;
            const dialog = picker.shadowRoot?.querySelector('dialog') as HTMLDialogElement;

            button.click();
            expect(dialog.open).to.be.false;
        });

        it('should close the dialog when the ok button is clicked', async () => {
            const button = picker.shadowRoot?.querySelector('[part="confirm"]') as HTMLButtonElement;
            const dialog = picker.shadowRoot?.querySelector('dialog') as HTMLDialogElement;

            button.click();
            expect(dialog.open).to.be.false;
        });

        it('should open the eyedropper', async () => {
            const button = picker.shadowRoot?.querySelector('[part="eyedropper"]') as HTMLButtonElement;

            const openStub = sinon.stub().resolves({ sRGBHex: '#ff5733' });
            const eyeDropperStub = sinon.stub(window as any, 'EyeDropper').returns({ open: openStub });
    
            button.click();

            expect(eyeDropperStub.calledOnce).to.be.true;
            expect(openStub.calledOnce).to.be.true;

            eyeDropperStub.restore();
        });

        it('should not open the eyedropper', async () => {
            const button = picker.shadowRoot?.querySelector('[part="eyedropper"]') as HTMLButtonElement;

            const openStub = sinon.stub().rejects(new Error('EyeDropper failed'));
            const eyeDropperStub = sinon.stub(window as any, 'EyeDropper').returns({ open: openStub });

            const spy = sinon.spy();
            picker.addEventListener('update-color', spy);
            button.click();
            expect(spy.calledOnce).to.be.false;
            eyeDropperStub.restore();
        });
    });


    describe('Update Color', () => {
        beforeEach(async () => {
            picker = await fixture(html`<color-picker></color-picker>`);
            picker.setAttribute('open', 'true');
        });

        it('should dispatch update-color (from input)', async () => {           
            const hexInput = picker.shadowRoot?.querySelector('[part="hex-input"]') as HTMLInputElement;
            hexInput.value = '#ff5733';

            const spy = sinon.spy();
            picker.addEventListener('update-color', spy);

            hexInput.dispatchEvent(new Event('input', { bubbles: true }));
            expect(spy.callCount).to.equal(1);

            hexInput.dispatchEvent(new Event('focusout', { bubbles: true }));
            expect(spy.callCount).to.equal(2);

            
            const hueRange = picker.shadowRoot?.querySelector('[part="sliders"] [name="hue-range"]') as HTMLInputElement;

            expect(hueRange.value).to.equal('11');
        });

        it('should dispatch update-color (from sliders)', async () => {           
            const sliders = picker.shadowRoot?.querySelector('[part="sliders"]') as HTMLInputElement;
            const hueRange = sliders.querySelector('[name="hue-range"]') as HTMLInputElement;
            const hueOutput = sliders.querySelector('[name="hue-output"]') as HTMLInputElement;
            hueRange.value = '200';
            hueOutput.value = '50';

            const spy = sinon.spy();
            picker.addEventListener('update-color', spy);

            hueRange.dispatchEvent(new Event('input', { bubbles: true }));
            expect(spy.callCount).to.equal(1);

            hueOutput.dispatchEvent(new Event('input', { bubbles: true }));
            expect(spy.callCount).to.equal(2);
        });

        it('should dispatch update-color (from sliders, no value)', async () => {           
            const sliders = picker.shadowRoot?.querySelector('[part="sliders"]') as HTMLInputElement;
            const hueOutput = sliders.querySelector('[name="hue-output"]') as HTMLInputElement;
            hueOutput.value = '';

            const spy = sinon.spy();
            picker.addEventListener('update-color', spy);

            hueOutput.dispatchEvent(new Event('input', { bubbles: true }));
            expect(spy.callCount).to.equal(1);
        });

        it('should dispatch update-color (from area)', async () => {           
            const area = picker.shadowRoot?.querySelector('[part="area"]') as HTMLDivElement;
            const cursor = picker.shadowRoot?.querySelector('[part="area-cursor"]') as HTMLSpanElement;

            const spy = sinon.spy();
            picker.addEventListener('update-color', spy);

            area.dispatchEvent(new Event('pointerdown', { bubbles: true }));
            expect(spy.callCount).to.equal(1);

            cursor.dispatchEvent(new Event('pointerdown', { bubbles: true }));
            expect(spy.callCount).to.equal(1);
        });
    });

    describe('dialog dragging', () => {
        beforeEach(async () => {
            picker = await fixture(html`<color-picker></color-picker>`);
            picker.setAttribute('open', 'true');
        });
    
        it('should move the dialog when dragging the header', async () => {           
            const header = picker.shadowRoot?.querySelector('header') as HTMLElement;
            const dialog = picker.shadowRoot?.querySelector('dialog') as HTMLDialogElement;

            header.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 0, clientY: 0 }));

            document.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 50, clientY: 50 }));
            expect(dialog.style.transform).to.match(/translate3d\(50px, 50px, 0px\)/);

            document.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
            expect(dialog.style.transform).to.match(/translate3d\(50px, 50px, 0px\)/);
        });

        it('should not move the dialog when clicking a button in the header', async () => {
            const header = picker.shadowRoot?.querySelector('header') as HTMLElement;
            const dialog = picker.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
            const button = header.querySelector('button') as HTMLButtonElement;
    
            button.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 0, clientY: 0 }));
            document.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 50, clientY: 50 }));
            
            expect(dialog.style.transform).to.be.empty;

            document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
        });
    });
});