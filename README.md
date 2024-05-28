<div align="center">
  <a href="https://npmjs.org/package/color-dialog-box">
    <img alt="npm" src="https://badgen.net/npm/v/color-dialog-box" />
  </a>
  <a href="https://bundlephobia.com/result?p=color-dialog-box">
    <img alt="gzip size" src="https://badgen.net/bundlephobia/minzip/color-dialog-box" />
  </a>
  <a href="https://npmjs.org/package/color-dialog-box">
    <img alt="no dependencies" src="https://badgen.net/bundlephobia/dependency-count/color-dialog-box" />
  </a>
</div>

<br />

A simple and lightweight vanilla JS (no dependencies) color dialog box with alpha selection.

## User Features

- **HSLA** Sliders for precise color adjustments
- **Hex** input supporting #rrggbbaa notation
- Integrated **color picker**
- **EyeDropper** tool (only for Chromium-based browsers)
- Quick access to **[ColorHexa](https://www.colorhexa.com/)**, the color encyclopedia

## Features

- 🗜 **Lightweight**: Only 5.9 KB (minified and gzipped).
- ⚡ **Fast**: Built with standards based [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements).
- 😎 **Framework-agnostic**: Can be used with [any framework](https://custom-elements-everywhere.com/).
- 🛡 **Bulletproof**: Written in strict TypeScript with 100% test coverage.
- 📱 **Mobile-friendly**: Works well on mobile devices.
- 🧩 **No dependencies**

## Install

```
npm install color-dialog-box --save
```

## Basic Usage

```html
<button>Open the color picker</button>
<color-picker></color-picker>
<script type="module">
    import 'color-dialog-box';

    const open = e => {
        picker.setAttribute('open', true);
    };

    const update = e => {
        console.log(e.detail.hex);
    };

    bt.addEventListener('click', open);
    picker.addEventListener('update-color', update);
</script>
```

> **Note**
>
> You'll probably only want to add a single instance of `<color-picker>`, even if you need to change the color of different parts of the document. See an advanced example for more details.
>

## Customization

### Default Color

To set a default color, you can add a `hex` attribute to the `<color-picker>` element. For example:

```html
<color-picker hex="#ff4400"></color-picker>
```

### Open on Load

By default, the color dialog box is hidden. To open it when the page loads, use the `open` attribute set to `true`:
```html
<color-picker hex="#ff4400" open="true"></color-picker>
```

### Styling

color-dialog-box supports [CSS Shadow Parts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_shadow_parts) and CSS Variables for custom styling.

Supported part names: 
`dialog`, `header`, `wrapper`, `hex`, `preview`, `area`, `sliders`

Example (of a dark theme) :

```html
color-picker {
    --bg-primary: #212031;
    --bg-secondary: #343445;
    --border-color-primary: #494b6f;
    --border-color-secondary: #6d7bff;
    --bg-header: #15161b;
    --txt-color-primary: #fff;
}

color-picker::part(cancel),
color-picker::part(eyedropper),
color-picker::part(info) {
    filter: invert(1);
}
```





## Project using color-dialog-box

* [ColorBeta](https://colorbeta.com/): Advanced CSS Gradient Generator


