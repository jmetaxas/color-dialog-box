import { expect } from '@esm-bundle/chai';
import { ColorUtils } from "../src/lib/utils/color";

describe('ColorUtils Conversions', () => {
	let colorUtils: ColorUtils;

	beforeEach(() => {
		colorUtils = new ColorUtils();
	});

	describe('from HSL', () => {
		beforeEach(() => {
			colorUtils.fromHsl({h: 0, s: 100, l: 50});
			colorUtils.setOpacity(70);
		});

		it('converts to HSL', () => {
			expect(colorUtils.toHsl()).to.deep.equal({h: 0, s: 100, l: 50});
			expect(colorUtils.toHsl()).to.deep.equal({h: 0, s: 100, l: 50});
		});

		it('converts to HSV', () => {
			expect(colorUtils.toHsv()).to.deep.equal({h: 0, s: 100, v: 100});
			expect(colorUtils.toHsv()).to.deep.equal({h: 0, s: 100, v: 100});
		});

		it('converts to RGB', () => {
			expect(colorUtils.toRgb()).to.deep.equal({r: 255, g: 0, b: 0});
			expect(colorUtils.toRgb()).to.deep.equal({r: 255, g: 0, b: 0});
		});

		it('converts to Hex', () => {
			expect(colorUtils.toHex()).to.equal("#ff0000b3");
			expect(colorUtils.toHex()).to.equal("#ff0000b3");
		});

		it('converts to Opacity', () => {
			expect(colorUtils.toOpacity()).to.equal(70);
		});
	});

	describe('from HSL (0, 0, 0)', () => {
		beforeEach(() => {
			colorUtils.fromHsl({h: 0, s: 0, l: 0});
			colorUtils.setOpacity(0);
		});

		it('converts to HSV', () => {
			expect(colorUtils.toHsv()).to.deep.equal({h: 0, s: 0, v: 0});
		});

		it('converts to HSL', () => {
			expect(colorUtils.toHsl()).to.deep.equal({h: 0, s: 0, l: 0});
		});

		it('converts to RGB', () => {
			expect(colorUtils.toRgb()).to.deep.equal({r: 0, g: 0, b: 0});
		});

		it('converts to Hex', () => {
			expect(colorUtils.toHex()).to.equal("#00000000");
		});

		it('converts to Opacity', () => {
			expect(colorUtils.toOpacity()).to.equal(0);
		});
	});

	describe('from 0000ff', () => {
		beforeEach(() => {
			colorUtils.fromHex('0000ff');
		});

		it('converts to HSV (when v -> max(rgb) = b)', () => {
			expect(colorUtils.toHsv()).to.deep.equal({h: 240, s: 100, v: 100});
		});
	});

	describe('from Hex (with alpha)', () => {
		beforeEach(() => {
			colorUtils.fromHex("ff060975");
		});

		it('converts to HSV', () => {
			expect(colorUtils.toHsv()).to.deep.equal({h: 359, s: 98, v: 100});
		});

		it('converts to HSL', () => {
			expect(colorUtils.toHsl()).to.deep.equal({h: 359, s: 100, l: 51});
		});

		it('converts to RGB', () => {
			expect(colorUtils.toRgb()).to.deep.equal({r: 255, g: 6, b: 9});
		});

		it('converts to Hex', () => {
			expect(colorUtils.toHex()).to.equal("#ff060975");
		});

		it('converts to Opacity', () => {
			expect(colorUtils.toOpacity()).to.equal(46);
		});
	});

	describe('from #Hex (with alpha)', () => {
		beforeEach(() => {
			colorUtils.fromHex("#ff060975");
		});

		it('converts to HSV', () => {
			expect(colorUtils.toHsv()).to.deep.equal({h: 359, s: 98, v: 100});
		});

		it('converts to HSL', () => {
			expect(colorUtils.toHsl()).to.deep.equal({h: 359, s: 100, l: 51});
		});

		it('converts to RGB', () => {
			expect(colorUtils.toRgb()).to.deep.equal({r: 255, g: 6, b: 9});
		});

		it('converts to Hex', () => {
			expect(colorUtils.toHex()).to.equal("#ff060975");
		});

		it('converts to Opacity', () => {
			expect(colorUtils.toOpacity()).to.equal(46);
		});
	});

	describe('from Hex (no alpha)', () => {
		beforeEach(() => {
			colorUtils.fromHex("00ff00");
		});

		it('converts to HSV', () => {
			expect(colorUtils.toHsv()).to.deep.equal({h: 120, s: 100, v: 100});
		});

		it('converts to HSL', () => {
			expect(colorUtils.toHsl()).to.deep.equal({h: 120, s: 100, l: 50});
		});

		it('converts to RGB', () => {
			expect(colorUtils.toRgb()).to.deep.equal({r: 0, g: 255, b: 0});
		});

		it('converts to Hex', () => {
			expect(colorUtils.toHex()).to.equal("#00ff00ff");
		});

		it('converts to Opacity', () => {
			expect(colorUtils.toOpacity()).to.equal(100);
		});
	});

	describe('from #Hex (no alpha)', () => {
		beforeEach(() => {
			colorUtils.fromHex("#ff00ff");
		});

		it('converts to HSV', () => {
			expect(colorUtils.toHsv()).to.deep.equal({h: 300, s: 100, v: 100});
		});

		it('converts to HSL', () => {
			expect(colorUtils.toHsl()).to.deep.equal({h: 300, s: 100, l: 50});
		});

		it('converts to RGB', () => {
			expect(colorUtils.toRgb()).to.deep.equal({r: 255, g: 0, b: 255});
		});

		it('converts to Hex', () => {
			expect(colorUtils.toHex()).to.equal("#ff00ffff");
		});

		it('converts to Opacity', () => {
			expect(colorUtils.toOpacity()).to.equal(100);
		});
	});

	describe('from HSV', () => {
		beforeEach(() => {
			colorUtils.fromHsv({h: 45, s: 75, v: 69});
			colorUtils.setOpacity(55);
		});

		it('converts to HSV', () => {
			expect(colorUtils.toHsv()).to.deep.equal({h: 45, s: 75, v: 69});
		});

		it('converts to HSL', () => {
			expect(colorUtils.toHsl()).to.deep.equal({h: 45, s: 60, l: 43});
		});

		it('converts to RGB', () => {
			expect(colorUtils.toRgb()).to.deep.equal({r: 175, g: 143, b: 44});
		});

		it('converts to Hex', () => {
			expect(colorUtils.toHex()).to.equal("#af8f2c8c");
		});

		// it('converts to Opacity', () => {
		// 	expect(colorUtils.toOpacity()).to.equal(55);
		// });
	});
});