import { expect } from '@esm-bundle/chai';
import { clampValue, validateHex } from "../src/lib/utils/validators";

describe('Validate Hex', () => {
    it('validates #00ff00', () => {
        expect(validateHex("#00ff00")).to.equal("#00ff00ff");
    });

    it('validates 00ff00', () => {
        expect(validateHex("00ff00")).to.equal("#00ff00ff");
    });

    it('validates 0f0', () => {
        expect(validateHex("0f0")).to.equal("#00ff00ff");
    });

    it('validates razrt41è=dbx', () => {
        expect(validateHex("razrt41è=dbx")).to.equal("#0a41dbff");
    });
});


describe('Clamp Values', () => {
    it('clamps 500 to 360 (min: 0, max : 360)', () => {
        expect(clampValue(500, 0, 360)).to.equal(360);
    });

    it('returns 180 (min: 0, max : 360)', () => {
        expect(clampValue(180, 0, 360)).to.equal(180);
    });

    it('clamps -300 to 0 (min: 0, max : 360)', () => {
        expect(clampValue(-300, 0, 360)).to.equal(0);
    });
});