# CLAUDE.md — Project Rules & Conventions

This file tells Claude Code / Cursor how to behave in this repository.
Read it fully before writing, editing, or refactoring any code.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) — React 19
- **Language:** JavaScript only — no TypeScript, no `.ts` / `.tsx` files
- **Styling:** SCSS Modules (`*.module.scss`) + global SCSS utility classes
- **Fonts:** Poppins (`--font-primary`) and Inter (`--font-secondary`) via `next/font/google`
- **Package Manager:** npm
- **Path alias:** `@/` maps to `./src/`

---

## Folder Structure

```
src/
  app/              # Next.js App Router — pages, layouts, API routes
  components/       # Reusable UI components (each in its own folder)
  sections/         # Page sections (each in its own folder)
  styles/
    globals/        # variables, typography, globals, color classes
    helpers/        # extendables, mixins (media, trimlines)
    pages/          # Per-page SCSS modules
  data/             # Static JSON / JS data files
  enums/            # Route enums and constants
  services/         # API/data-fetching service files
  utils/            # Utility/helper functions
scripts/            # createComponent.js, createSection.js, createPage.js
public/             # Static assets
```

---

## Creating Components & Sections

**Always use the project scripts** — do not create component/section files manually.

```bash
npm run create-component component-name       # creates src/components/component-name/
npm run create-section section-name           # creates src/sections/section-name/
npm run create-page page-name                 # creates src/app/page-name/
```

Each script scaffolds both the JS file and the matching `.module.scss` automatically, with the correct import structure and comment blocks.

---

## Component File Structure

Every component/section file **must** follow this exact comment-block order:

```js
// MODULES //

// COMPONENTS //

// SECTIONS //

// PLUGINS //

// UTILS //

// STYLES //
import styles from "./ComponentName.module.scss";

// IMAGES //

// DATA //

/** ComponentName Component */
export default function ComponentName() {
	return <div className={styles.ComponentName}></div>;
}
```

- Use `/** ComponentName Component */` JSDoc comment directly above the function.
- Use **default exports** for components and sections.
- Use **named exports** only when a file exports multiple items (e.g. Accordion sub-components).

---

## Styling Rules

### Always use SCSS Modules for component-level styles

Every component has its own `ComponentName.module.scss`. Always start it with:

```scss
@use "@/styles/helpers/helpers.scss" as *;

.ComponentName {
}
```

### Never write inline font-size, font-weight, line-height, or color

Use the global typography and utility classes instead. Apply them directly as `className` strings on elements.

**Wrong — never do this:**

```scss
.my_title {
	font-size: 48px;
	font-weight: 700;
	line-height: 1.2;
	color: #e2c044;
}
```

**Correct — use global classes on the element:**

```jsx
<h2 className="text_xxxxl font-primary text_700 color_primary">Title</h2>
```

### Typography classes (defined in `src/styles/globals/typography.scss`)

Add new sizes there as needed. The base body size is `fs_18` (18px / line-height calc(27/18)).
Common pattern from the project: `text_xxxxl`, `text_sm`, etc. — follow the naming convention `text_<size>`.

### Font weight classes (from `dontUseIfTailwind.scss`)

```
text_300  text_400  text_500  text_600  text_700  text_800  text_900
```

### Font family classes (from `globals.scss`)

```
font-primary     → Poppins (--font-primary)
font-secondary   → Inter (--font-secondary)
```

### Color — always use CSS variables, never hardcode hex

Color variables are defined in `variables.scss`:

```
--color_primary     → #e2c044
--color_secondary   → #587b7f
--color_black       → #000000
--color_white       → #ffffff
```

Reference in SCSS: `var(--color_primary)` — never write raw hex values.

### Utility / layout classes

```
container            → centered wrapper with responsive --container_width
container-fluid      → full-width with 15px side padding
section_spacing      → padding: 10vmin 0
text_center          → text-align: center
text_uppercase       → text-transform: uppercase
text_italic          → font-style: italic
fadeInUp             → scroll-triggered fade-in animation (uses data-scroll)
```

### SCSS Extendables (from `extendables.scss`)

Use `@extend` for layout patterns instead of repeating flexbox rules:

```scss
@extend %d_flex; // display: flex
@extend %f_r_a_center; // flex row, align-items center
@extend %f_r_aj_center; // flex row, align + justify center
@extend %f_c_aj_center; // flex column, align + justify center
@extend %full_overlay; // position absolute, full cover
@extend %relative_box; // position relative, min-height 1px
@extend %rel_xy_center; // absolute centered (translate trick)
```

### Media query mixins (from `media.scss`)

Always use these mixins — never write raw `@media` queries directly.

```scss
@include sm-down {
} // max-width: 767px
@include md-down {
} // max-width: 991px
@include lg-down {
} // max-width: 1199px
@include sm-up {
} // min-width: 768px
@include md-up {
} // min-width: 992px
@include lg-up {
} // min-width: 1200px
// Also available: xxxs, xxs, xs, mdl, xl, xxl, xxxl variants
```

Breakpoint reference:

```
$xxxs: 320px  |  $xxs: 480px  |  $xs: 640px   |  $sm: 768px
$md: 992px    |  $mdl: 1025px |  $lg: 1200px  |  $xl: 1366px
$xxl: 1440px  |  $xxxl: 1700px
```

---

## How to Pass Classes on Elements

Use template literals. Module-scoped classes come from `styles.*`, global utility classes are plain strings:

```jsx
// Combining module + global classes
<div className={`${styles.card_wrap} container fadeInUp`}>

// Dynamic module classes
<button className={`${styles.btn_common_styles} ${styles[`btn_${color}`]} text_sm font-secondary text_600`}>

// Conditional classes
<div className={`${styles.main_header} ${openSidebar ? styles.sidebar_opened : ""}`}>
```

- Module class names must be `snake_case` inside SCSS modules.
- Global classes go as plain strings inside the template literal.

---

## Container / Layout Divs

Always use the `.container` or `.container-fluid` global class for page-level wrappers — do not recreate this in SCSS modules.

```jsx
// Page layout pattern
<main className={styles.HomePage}>
  <div className="container">
    {/* content */}
  </div>
</main>

// Section layout pattern
<div className={styles.SectionName}>
  <div className="container">
    {/* content */}
  </div>
</div>
```

For full-bleed background sections, the section div holds the background and `.container` sits inside it.

---

## Scroll Animations

Add `fadeInUp` class to any element that should animate on scroll:

```jsx
<h2 className="fadeInUp font-primary text_xxxxl">Heading</h2>
<section className="fadeInUp">...</section>
```

The `ScrollEffectWrapper` component is already in `layout.js` — do not add it again.

---

## Installed Packages — Use These, Don't Reinvent

| Purpose            | Package             |
| ------------------ | ------------------- |
| Smooth scroll      | `lenis`             |
| Scroll animations  | `scroll-out`        |
| Forms              | `react-hook-form`   |
| CMS HTML rendering | `html-react-parser` |
| Image optimisation | `sharp`             |
| SCSS               | `sass`              |

- Do not install `moment.js` — use native `Date` or add `date-fns` if needed.
- Do not install Redux — use React Context or Zustand if state management is needed.
- Always check if an existing utility in `src/utils/` covers the need before adding a package.

---

## General Rules

- **JavaScript only** — never add `.ts`, `.tsx`, or TypeScript config.
- **No inline styles** — no `style={{ }}` props anywhere except for truly dynamic values (e.g. background image URL from data).
- **No hardcoded font sizes, weights, or colors in SCSS modules** — always use global classes or CSS variables.
- **Use `@/` alias** for all internal imports — never relative `../../` paths.
- **Images** — always use Next.js `<Image>` from `next/image`.
- **Links** — always use Next.js `<Link>` from `next/link` for internal navigation.
- Do not refactor working code unless explicitly asked.
- Do not install new packages without checking the existing stack first.
- If something is unclear, ask before assuming.

## Input validation

-Before creating or modifying ANY form, input field, or API route/server action that accepts user input, read and follow @INPUT_VALIDATION.md

-Use the shared validators in utils/fields.js; do not hand-roll limits or regex.

-Validate on the server with a strict schema; frontend validation is usability only.

-At the end of your response, list which items of the pre-merge checklist in INPUT_VALIDATION.md apply and how each was handled.

-If a request conflicts with INPUT_VALIDATION.md, say so and ask before proceeding.
