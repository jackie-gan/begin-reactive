import typescript from 'rollup-plugin-typescript';

const config = {
  input: ['src/index.ts'],
  output: {
    file: 'dist/index.js',
    format: 'iife',
    name: 'Begin'
  },
  plugins: [
    typescript()
  ]
};

export default config;
