import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import cjs from 'rollup-plugin-commonjs';

module.exports = {
  input: './src/index.ts',
  external: ['react'],
  output: {
    format: 'cjs',
    file: 'lib/react-css-context.js'
  },
  plugins: [
    nodeResolve(),
    typescript({
      clean: true,
      rollupCommonJSResolveHack: true,
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          module: 'esnext'
        },
        excludes: [
          '**/__tests__/*.tsx'
        ]
      },
    }),
    cjs()
  ],
};
