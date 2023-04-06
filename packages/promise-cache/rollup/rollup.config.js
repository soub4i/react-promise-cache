const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const json = require('@rollup/plugin-json');
const replace = require('@rollup/plugin-replace');
const {babel} = require('@rollup/plugin-babel');
const gzipPlugin = require('rollup-plugin-gzip');
const terser = require('@rollup/plugin-terser');
const copy = require('rollup-plugin-copy');
const dts = require('rollup-plugin-dts').default;

const libraryName = 'react-promise-cache';

const esModulesBuild = [
  {
    input: `src/index.ts`,
    output: {
      format: "esm",
      dir: 'dist/es',
      sourcemap: true,
      preserveModules: true,
      globals: {
        react: 'React',
        'react/jsx-runtime': 'jsxRuntime',
      }
    },
    external: ['react'],
    treeshake: {
      moduleSideEffects: false,
    },
    plugins: [
      json(),
      resolve(),
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            target: 'ESNEXT',
            declaration: false,
          },
          exclude: [
            "node_modules",
            "src/__tests__",
            "src/index-prod.js"
          ]
        }
      }),
      commonjs(),
    ]
  }
];

const umdBuild = [
  {
    input: `src/index.ts`,
    output: [
      {
        format: "umd",
        sourcemap: true,
        name: "ReactAsyncStates",
        file: `dist/umd/${libraryName}.development.js`,
        globals: {
          react: 'React',
          'react/jsx-runtime': 'jsxRuntime',
          'async-states': 'AsyncStates',
        }
      },
    ],
    external: ['react', 'react/jsx-runtime', 'async-states'],
    treeshake: {
      moduleSideEffects: false,
    },
    plugins: [
      json(),
      resolve(),
      babel({
        babelHelpers: "bundled",
      }),
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
          },
          exclude: [
            "node_modules",
            "src/__tests__",
            "src/index-prod.js"
          ]
        }
      }),
      commonjs(),
    ]
  },
  {
    input: `src/index.ts`,
    output: [
      {
        format: "umd",
        sourcemap: false,
        name: "ReactAsyncStates",
        file: `dist/umd/${libraryName}.production.js`,
        globals: {
          react: 'React',
          'react/jsx-runtime': 'jsxRuntime',
          'async-states': 'AsyncStates',
        }
      },
    ],
    external: ['react', 'react/jsx-runtime', 'async-states'],
    treeshake: {
      moduleSideEffects: false,
    },
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      json(),
      resolve(),
      babel({babelHelpers: 'bundled'}),
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
          },
          exclude: [
            "node_modules",
            "src/__tests__",
            "src/index-prod.js"
          ]
        }
      }),
      commonjs(),
      gzipPlugin.default(),
      terser({
        compress: {
          reduce_funcs: false,
        }
      }),
      copy({
        targets: [
          {
            dest: 'dist/umd',
            rename: 'index.js',
            src: 'src/index-prod.js',
          },
        ]
      }),
      copy({
        hook: 'closeBundle',
        targets: [
          {
            dest: 'dist',
            src: `../../README.MD`,
          },
        ]
      }),
    ]
  }
];

const declarationsBuild = {
  input: `src/index.ts`,
  output: [
    {
      format: 'es',
      dir: "dist/es",
      sourcemap: false,
      preserveModules: true,
      name: "ReactAsyncStates",
      globals: {
        react: 'React',
        'react/jsx-runtime': 'jsxRuntime',
        'async-states': 'AsyncStates',
      }
    },
  ],
  external: ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'async-states'],
  plugins: [
    json(),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: false,
          declaration: false,
          declarationMap: false,
        },
        exclude: [
          "node_modules",
          "src/__tests__",
          "src/index-prod.js"
        ]
      }
    }),
    dts(),
  ],
};

module.exports = [
  ...esModulesBuild,
  ...umdBuild,
  declarationsBuild,
];
