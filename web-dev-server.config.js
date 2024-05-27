import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
    watch: true,
    nodeResolve: true,
    open: true,
    appIndex: 'demo/index.html',
    plugins: [
        esbuildPlugin({
            ts: true,
            tsx: true
        })
    ],
};