import babel from "rollup-plugin-babel";
import rollupNodeResolve from 'rollup-plugin-node-resolve';
import rollupJson from 'rollup-plugin-json';
import rollupCommonJs from 'rollup-plugin-commonjs';
import rollupMinify from 'rollup-plugin-babel-minify';

export default [
  {
    input: "./src/index.js",
    output: {
      file: "./lib/index.js",
      format: "cjs",
      name: "bundle"
    },
    plugins: [
      babel(),
      rollupMinify({
        comments: false,
      }),
    ]
  },
  {
    input: "./src/index.js",
    output: {
      file: "./lib/index.axios.js",
      format: "iife",
      name: "bundle"
    },
    plugins: [
      rollupCommonJs({
        include: 'node_modules/**',
      }),
      rollupNodeResolve({ browser: true }),
      rollupJson(),
      babel({
        presets: [['minify', {
          builtIns: false
        }]],
        comments: false
      }),
    ]
  }
];
