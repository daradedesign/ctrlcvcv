<p><img src="branding/logo.svg" alt="CtrlCVCV" height="64"></p>

# CtrlCVCV

A Chrome side panel extension (Vue 3 + Vuetify) with copy-ready answers for the job application fields that browser autofill usually misses.

## Pages

The panel has two tabs:

- **Use**: shows only the fields that have a value. Click a value to copy it. The Job details box is here so you can set the company and position for each application.
  - The toggle next to the search box switches between full values and compact **copy buttons**. Each button shows an icon and the field name; LinkedIn, GitHub, GitLab, Stack Overflow and X/Twitter links get their own logo. Hover over a button to see what it will copy.
- **Edit**: shows every field, including empty ones. Click a field to edit it, and add or delete fields here.
  - To move a field to another section, use the folder button on its row, or the **Section** dropdown in the field editor.
  - **Sections**: use **Add section** (at the bottom, or in the ⋮ menu) to create your own section with a name and an icon.
  - Each section's bottom row has buttons to move it up or down, and a **Section** button to rename it, change its icon or delete it.
  - To reorder several sections at once, use **Reorder** (next to **Add section**, or **Reorder sections…** in the ⋮ menu). Drag sections into place, or use the arrows.
  - When you delete a section that still has fields, you choose whether to move them to another section or delete them too. The last remaining section can't be deleted.

The panel opens on Use once you've filled in at least one field. Until then it opens on Edit.

## Features

- **Links**: LinkedIn, GitHub profile, GitHub repository, portfolio and other links.
- **Phone**: one number, 11+ formats (`(555) 867-5309`, `555-867-5309`, `+15558675309`, `+1 (555) 867-5309`, …).
- **Salary**: annual amount plus an optional range max. Gives plain, comma, currency, `$120k`, monthly, hourly (÷2080) and range formats in 13 currencies.
- **Dates**: start date, graduation date and an always-today date for signatures, in 13 formats (`MM/DD/YYYY`, ISO, `DD/MM/YYYY`, `Month D, YYYY`, `MM/YYYY`, …).
- **Cover letters and long answers**: shows word and character counts. Supports `{{company}}`, `{{position}}`, `{{hiringManager}}` and `{{date}}` placeholders, which are filled from the **Job details** panel when you copy.
  - If you leave a job detail blank, its generic default is used instead: "your organization", "the advertised position" and "Hiring Manager". You can change these under **Job detail defaults** on the Edit page.
  - A blue "generic" chip shows which placeholders are using a default. A placeholder with no job detail and no default stays as `{{key}}` and gets an orange warning.
- **Quick answers**: how you heard about the job, work authorization, notice period, and similar questions.
- Click a value to copy it. Expand (˅) to see every format, and star a format to make it that field's default.
- Add, edit and delete fields, search them, and use a dark theme. You can export and import a JSON backup.
- Data is saved in `chrome.storage.local` and stays on your machine. If the panel is open in more than one Chrome window, a change in one shows up in the others straight away.

## Build and install

```bash
npm install
npm run build
```

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and select the `dist/` folder.
3. Click the CtrlCVCV toolbar icon to open the side panel. Pin the icon first if Chrome hides it.

Use `npm run watch` to rebuild on every change, then click the reload button for the extension on `chrome://extensions`.

`npm run dev` serves the panel at `http://localhost:5173/sidepanel.html` for UI work. Outside the extension it saves to `localStorage`.

## Layout

- `public/manifest.json`: MV3 manifest with the side panel, storage and clipboardWrite permissions.
- `public/background.js`: makes the toolbar icon open the side panel.
- `scripts/make-icons.mjs`: generates the PNG icons at build time.

`src/`:

- `main.js`: loads saved data, then mounts the app. `plugins/vuetify.js` holds the Vuetify setup and `styles/global.css` the global styles.
- `App.vue`: the shell, with the header, search box, active page, dialogs and snackbar.
- `pages/UsePage.vue` and `pages/EditPage.vue`: the two tabs.
- `lib/`: plain JavaScript with no UI.
  - `formats.js`: phone, salary and date formatters, and `{{placeholder}}` filling.
  - `fieldIcons.js`: the icon for each field in the copy-button view.
  - `defaults.js`: default sections, fields and job details, section icons and field types.
  - `store.js`: saved reactive state, and every function that changes fields or sections. It also migrates older saves.
- `composables/`: shared logic for components.
  - `useFields`: formats, filled-in counts and search matching.
  - `useSectionGroups`: sections with the fields they show.
  - `useSectionPanels`: which sections are collapsed.
  - `useEditors`: opens the field and section dialogs from anywhere.
  - `useClipboard` and `useNotifier`: copying, and the snackbar.
  - `useAppTheme` and `useBackup`: the theme, and export, import and reset.
- `components/`:
  - `layout/`: `AppHeader`, `AppMenu` (the ⋮ menu), `UseViewToggle`, `AppLogo`, `AppNotification` and `ResetDialog`.
  - `fields/`: `FieldItem` (one row), `FieldButton` (the Use page's copy-button view), `FieldSectionMenu` (move to another section), `FieldFormatList`, `FieldTextInfo` (counts and placeholder chips), `FieldEditor` and `FieldValueInput` (the inputs for each type).
  - `sections/`: `SectionList`, `SectionActions`, `SectionEditor`, `SectionIconPicker` and `SectionOrderDialog` (drag to reorder).
  - `job-details/`: `JobDetailsPanel` (Use page) and `JobDetailDefaultsPanel` (Edit page).
  - `common/`: `CollapsiblePanel` and `NoSearchResults`.
  - `EditorDialogs.vue`: mounts the field and section dialogs once and saves their results.

## Branding

- `branding/logo.svg`: the wordmark, with ctrl, C and V keycaps followed by a CV document.
- `branding/icon.svg`: the square icon mark, used for the 48px and 128px icons.
- `branding/icon-small.svg`: a simplified mark for the 16px and 32px icons.
- `src/components/AppLogo.vue`: the wordmark as a component. `variant="light"` is for dark backgrounds.

`npm run build` renders the PNG icons from these SVGs into `public/icons/` using resvg.
