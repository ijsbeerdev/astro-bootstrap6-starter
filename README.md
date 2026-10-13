# Astro + Bootstrap 6

An empty [Astro](https://docs.astro.build) starter wired up with [Bootstrap 6](https://getbootstrap.com/docs/6.0/) (`6.0.0-alpha.1`), Bootstrap Icons, Sass, Autoprefixer, PurgeCSS and Stylelint.

## Project structure

```text
/
├── .claude/skills/          # Bootstrap agent skills (npx skills add twbs/bootstrap)
├── public/
├── src/
│   ├── layouts/
│   │   └── Layout.astro     # Loads main.scss and Bootstrap's JS
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── main.scss        # Bootstrap + Bootstrap Icons
├── .browserslistrc          # Copied from Bootstrap 6 (Autoprefixer targets)
├── postcss.config.mjs       # --bs- prefix, Autoprefixer, PurgeCSS (build only)
└── stylelint.config.mjs     # stylelint-config-twbs-bootstrap
```

## Commands

| Command                | Action                                                |
| :--------------------- | :---------------------------------------------------- |
| `npm install`          | Install dependencies                                  |
| `npm run dev`          | Start the dev server at `localhost:4321`              |
| `npm run build`        | Build the production site to `./dist/`                |
| `npm run preview`      | Preview the build locally                             |
| `npm run lint:css`     | Lint `.css`/`.scss` with Bootstrap's Stylelint config |
| `npm run lint:css:fix` | Lint and auto-fix stylesheets                         |
| `npm run format`       | Format everything else with Prettier                  |

## How the CSS pipeline works

1. **Sass** compiles `src/styles/main.scss`, which pulls in Bootstrap with `@use` (Bootstrap 6 does not support `@import`). Customize tokens with `@use "bootstrap/scss/bootstrap" with ($root-tokens: (...))`. See [Customize › Sass](https://getbootstrap.com/docs/6.0/customize/sass/).
2. **postcss-prefix-custom-properties** adds the `--bs-` prefix to custom properties, the same step Bootstrap uses to build its dist CSS. Bootstrap's JS reads `--bs-breakpoint-*`, `--bs-carousel-*` and other prefixed properties, so keep this plugin. Because it also prefixes custom properties in your own stylesheets, use the `--bs-` name when you set one inline or from JS.
3. **Autoprefixer** adds vendor prefixes for the browsers in `.browserslistrc`.
4. **PurgeCSS** runs on `npm run build` only. It removes selectors that aren't used in `src/**` or in Bootstrap's JS. If you build class names dynamically (for example `` `btn-${variant}` ``), add them to the `safelist` in `postcss.config.mjs`.

## JavaScript

`Layout.astro` imports all of Bootstrap's JS, which registers the `data-bs-*` API. To keep the bundle smaller, import only the plugins you use:

```js
import { Tooltip, Dialog } from 'bootstrap';
```

`@floating-ui/dom` (menus, popovers, tooltips) and `vanilla-calendar-pro` (datepicker) are Bootstrap's peer dependencies.

## Agent skills

Bootstrap's skills (`bootstrap-v6-install`, `bootstrap-component`, `bootstrap-utility-api`, and others) are installed in `.claude/skills/` and pinned in `skills-lock.json`. Run `npx skills update` to update them.
