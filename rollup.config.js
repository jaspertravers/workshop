//copied from https://github.com/rollup/rollup-starter-app/blob/master/rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-node-polyfills';

import livereload from 'rollup-plugin-livereload';

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
		resolve({ preferBuiltins: true}),
		commonjs(), // converts date-fns to ES modules
    json(), // trying to fix error pointing at json module
    nodePolyfills(),
    livereload({delay : 200}),
		production && terser() // minify, but only in production
	]
};
