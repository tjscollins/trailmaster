// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'server/server.js',
  format: 'iife',
  plugins: [
    resolve(),
    babel({
      'presets': [
        [
          'es2015',
          {
            'modules': false
          }
        ]
      ],
      'plugins': [
        'external-helpers'
      ],
      'exclude': 'node_modules/**' // only transpile our source code
    })
  ],
  dest: 'server.js'
};
