import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import sass from 'rollup-plugin-sass';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import html from 'rollup-plugin-bundle-html';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		file: 'public/bundle.js',
		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: true
	},
	plugins: [
		resolve(), // tells Rollup how to find date-fns in node_modules
		commonjs(), // converts date-fns to ES modules
		production && terser(), // minify, but only in production
		sass({
			output: 'public/styles/bundle.css',
		}),
		serve(),
		livereload('public'),
		html({
			template: 'src/index.html',
			dest: "public",
			filename: 'index.html',
			inject: 'head'
		}),
		svg()
	]
};
