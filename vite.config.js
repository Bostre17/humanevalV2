const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env

export default {
    root: 'src/',
    publicDir: '../static/',
    base: '/humanevalV2/',
    server:
    {
        host: true,
        open: !isCodeSandbox // Open if it's not a CodeSandbox
    },
    build:
    {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true
    },
    esbuild: {
        target: 'es2015', // o una versione di ECMAScript supportata
        include: ['.js', '.jsx', '.ts', '.tsx', '.json', '.html'],
      },
}