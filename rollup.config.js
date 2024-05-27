import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import importCss from 'rollup-plugin-import-css';

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/index.js',
        format: 'es'
    },
    plugins: [
        typescript({ tsconfig: './tsconfig.json' }),
        importCss({
            minify: true,
            modules: true
        }),
        terser()
    ]
};
