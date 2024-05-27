import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
    nodeResolve: true,
    plugins: [
        esbuildPlugin({ ts: true }),
    ],
    coverageConfig: {
        threshold: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100
        }
    },
};