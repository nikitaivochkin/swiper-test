import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import sass from 'rollup-plugin-sass';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import html from 'rollup-plugin-bundle-html';
import image from 'rollup-plugin-img';
import svg from 'rollup-plugin-svg';
import copy from 'rollup-plugin-copy';
import imagemin from 'rollup-plugin-imagemin';
import { eslint } from 'rollup-plugin-eslint';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    production && terser(),
    sass({
      output: 'public/styles/bundle.css',
    }),
    serve(),
    livereload('public'),
    svg(),
    copy({
      targets: [
        { src: 'src/svg/*', dest: 'public/svg' },
      ],
    }),
    imagemin(),
    image({
      output: 'public/img',
    }),
    eslint(),
    html({
      template: 'src/index.html',
      dest: 'public',
      filename: 'index.html',
      inject: 'head',
    }),
  ],
};
