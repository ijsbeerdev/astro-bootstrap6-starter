import purgecss from '@fullhuman/postcss-purgecss';
import autoprefixer from 'autoprefixer';
import postcssPrefixCustomProperties from 'postcss-prefix-custom-properties';

const isProduction = process.env.NODE_ENV === 'production';

// Same as Bootstrap's own build (build/postcss.config.mjs): Autoprefixer prefixes
// `transition` inside `::-webkit-slider-thumb` / `::-moz-range-thumb` rules only
// because the selector is prefixed, so drop the redundant declarations.
const removeRedundantPrefixes = {
  postcssPlugin: 'remove-redundant-prefixes',
  OnceExit(root) {
    root.walkDecls((decl) => {
      if (
        decl.prop === '-webkit-transition' ||
        decl.prop === '-moz-transition'
      ) {
        decl.remove();
      }
    });
  },
};

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    // Bootstrap's Sass emits unprefixed tokens (`--spacer`); its dist CSS and JS
    // expect `--bs-spacer`, so add the prefix exactly like Bootstrap's build does.
    postcssPrefixCustomProperties({
      prefix: 'bs-',
      ignore: [/^--bs-/, /^--bd-/],
    }),
    autoprefixer({ cascade: false }),
    removeRedundantPrefixes,
    // Strip unused selectors from production builds only, so `astro dev` keeps all of Bootstrap.
    isProduction &&
      purgecss({
        content: [
          './src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx,svelte,vue}',
          // Classes and attributes that Bootstrap's JavaScript adds at runtime
          './node_modules/bootstrap/js/dist/**/*.js',
        ],
        safelist: {
          greedy: [
            // Astro scoped styles (`.foo[data-astro-cid-xxxx]`)
            /data-astro-cid-/,
            // Datepicker markup rendered by vanilla-calendar-pro
            /data-vc/,
          ],
        },
      }),
  ].filter(Boolean),
};
