const config = {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
    exports: 'named',
  },
  external: ['path', 'fs', 'iobuffer'],
};

export default config;
