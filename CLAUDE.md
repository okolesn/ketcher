# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ketcher is an open-source web-based chemical structure editor (TypeScript, React, Redux) supporting molecules, reactions, macromolecules, and monomers. It uses a custom MVC rendering model with SVG output.

## Monorepo Structure

npm workspaces monorepo. Core packages, in build dependency order:

- `packages/ketcher-core` — Chemical domain logic, serializers (MOL/RXN/SMILES/CML/KET), SVG rendering engine, and the public `Ketcher` API
- `packages/ketcher-standalone` — Client-side WASM integration via `indigo-ketcher`
- `packages/ketcher-react` — React `<Editor>` component, Redux UI state, LESS styles
- `packages/ketcher-macromolecules` — Macromolecule editor (peptides, nucleic acids, HELM/FASTA); uses Redux-Saga

Supporting workspaces: `example/`, `demo/`, `example-ssr/`, `example-separate-editors/`, `ketcher-autotests/`.

## Commands

### Setup
```bash
npm install           # installs all workspaces
```

### Build
```bash
npm run build                  # full build: all packages + example app
npm run build:packages         # packages only (core → standalone+react in parallel → macromolecules)
npm run build:core             # ketcher-core only
npm run build:standalone       # ketcher-standalone only
npm run build:react            # ketcher-react only
npm run build:macromolecules   # ketcher-macromolecules only
```

### Development (watch mode)
Run each in a separate terminal, then start the example dev server:
```bash
npm start -w packages/ketcher-core
npm start -w packages/ketcher-react
cd example && npm run dev:standalone   # or dev:remote
```
Or use the convenience script: `npm run up` (runs `scripts/build-run.mjs`).

### Tests
```bash
npm test                       # unit tests across all packages (prettier + eslint + types + jest)
npm run test:types             # tsc --noEmit across all workspaces

# Per-package (example: ketcher-core)
cd packages/ketcher-core
npm run test:unit              # jest only
npm run test:unit:update       # update jest snapshots
npm run test:eslint:fix        # auto-fix lint
npm run prettier:write         # auto-format

npm run check:autotests        # validate Playwright test code (ketcher-autotests)
```

### Serve built output
```bash
npm run serve:standalone       # serve example in standalone mode
npm run serve:remote           # serve example in remote Indigo mode
```

## Architecture

### Layers (ketcher-core)

```
src/domain/         — Entities (Atom, Bond, Struct, SGroup, monomers…), serializers, services, helpers
src/application/    — Editor controller, rendering pipeline, formatters, public Ketcher API
src/infrastructure/ — Remote/WASM struct service providers
```

- `src/application/ketcher.ts` — main public API surface
- `src/application/ketcherBuilder.ts` — builder pattern for configuration
- `src/application/editor/` — Editor class and tool system
- `src/application/render/` — SVG rendering engine (Raphael-based)

### MVC Model
- **Model**: chemical objects — `Atom`, `Bond`, `Struct`, monomers, coordinates (Angstrom-like units, Ketcher internal IDs)
- **View**: SVG rendering via Raphael; `Re*` prefixed classes (ReAtom, ReBond…)
- **Controller**: editor tools and user interaction logic

### ketcher-react
- `src/script/` — API adapters, builders, service providers
- `src/components/` — UI components (toolbar, dialogs, panels) using MUI v5 + Emotion
- Redux Toolkit for UI state; reducers are in `src/state/`

### ketcher-macromolecules
Extends the core editor with Redux-Saga side effects, monomer library management, and support for HELM/FASTA/sequence formats.

### Service Provider Pattern
Two modes of Indigo integration:
- `RemoteStructServiceProvider` — REST API calls to a separate Indigo backend
- `StandaloneStructServiceProvider` (ketcher-standalone) — client-side WASM via `indigo-ketcher`

## Coding Conventions

From the project's Copilot guidelines (`.github/copilot-instructions.md`):

**Do:**
- Prefer TypeScript strict mode: union types, mapped types, generics
- Use React functional components and Redux Toolkit patterns
- Keep model objects immutable; mutate only through Redux reducers/actions
- Use pure functions for calculations and coordinate transforms
- Reference existing Ketcher services, helpers, actions, and controllers

**Do not:**
- Mutate Redux state directly
- Introduce libraries not already in the project (MobX, Lodash extra, RxJS, jQuery)
- Use React class components
- Use magic numbers without explaining them in comments
- Simplify chemistry logic (stereochemistry, valence validation, CFG parsing)
- Violate architectural boundaries (controller must not manipulate model internals directly)

## Toolchain

- **Build**: Rollup (packages), Vite (example dev), react-app-rewired/Webpack (example prod)
- **Testing**: Jest (unit), Playwright (E2E in `ketcher-autotests/`)
- **Linting**: ESLint + Prettier + Stylelint (`.less` files in react/macromolecules)
- **Git hooks**: Husky + lint-staged (pre-commit runs prettier+lint; pre-push runs `npm test && npm run test:types`)
- **Node**: >=24.14.1 | **npm**: >=7.0.0 (yarn is not used)
