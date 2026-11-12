// Default sections and fields: job-application questions that browser autofill usually misses.
import {
  mdiLinkVariant, mdiPhoneOutline, mdiCashMultiple, mdiCalendarOutline,
  mdiTextBoxOutline, mdiCommentQuestionOutline, mdiFolderOutline, mdiAccountOutline,
  mdiSchoolOutline, mdiBriefcaseOutline, mdiMapMarkerOutline, mdiStarOutline,
  mdiCertificateOutline, mdiTranslate, mdiCodeTags, mdiShieldAccountOutline,
  mdiHeartOutline, mdiLightbulbOutline, mdiAccountGroupOutline, mdiTagOutline,
} from '@mdi/js'
import { JOB_DETAIL_FIELDS } from './formats'

export const STATE_VERSION = 2

// ---------- Sections ----------

// Icons are saved by name so saved data stays small and readable.
export const SECTION_ICONS = {
  folder: mdiFolderOutline,
  link: mdiLinkVariant,
  phone: mdiPhoneOutline,
  cash: mdiCashMultiple,
  calendar: mdiCalendarOutline,
  text: mdiTextBoxOutline,
  question: mdiCommentQuestionOutline,
  person: mdiAccountOutline,
  school: mdiSchoolOutline,
  work: mdiBriefcaseOutline,
  location: mdiMapMarkerOutline,
  star: mdiStarOutline,
  certificate: mdiCertificateOutline,
  language: mdiTranslate,
  code: mdiCodeTags,
  legal: mdiShieldAccountOutline,
  heart: mdiHeartOutline,
  idea: mdiLightbulbOutline,
  people: mdiAccountGroupOutline,
  tag: mdiTagOutline,
}
export const DEFAULT_SECTION_ICON = 'folder'
export const sectionIconPath = (iconName) => SECTION_ICONS[iconName] ?? SECTION_ICONS[DEFAULT_SECTION_ICON]

export const defaultSections = () => [
  { id: 'links', title: 'Links', icon: 'link' },
  { id: 'contact', title: 'Phone', icon: 'phone' },
  { id: 'comp', title: 'Compensation', icon: 'cash' },
  { id: 'dates', title: 'Dates', icon: 'calendar' },
  { id: 'letters', title: 'Cover letters & long answers', icon: 'text' },
  { id: 'answers', title: 'Quick answers', icon: 'question' },
]

// ---------- Fields ----------

export const FIELD_TYPES = [
  { value: 'url', title: 'URL' },
  { value: 'short', title: 'Short text' },
  { value: 'long', title: 'Long text (cover letter, essay)' },
  { value: 'phone', title: 'Phone number (multi-format)' },
  { value: 'salary', title: 'Salary (multi-format)' },
  { value: 'date', title: 'Date (multi-format)' },
]
export const TEXT_FIELD_TYPES = ['url', 'short', 'long']
export const isMultiFormat = (type) => ['phone', 'salary', 'date'].includes(type)

export function emptyValueFor(type) {
  switch (type) {
    case 'phone': return { countryCode: '1', number: '', extension: '' }
    case 'salary': return { amount: null, max: null, currency: 'USD' }
    case 'date': return { iso: '', today: false }
    default: return { text: '' }
  }
}

export function createId(prefix = 'f') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function createField({ id = createId(), section, type = 'short', label = '', hint = '', value = {} }) {
  return { id, section, type, label, hint, value: { ...emptyValueFor(type), ...value } }
}

export function defaultFields() {
  let count = 0
  const field = (section, type, label, value = {}, hint = '') =>
    createField({ id: `default-${++count}`, section, type, label, hint, value })

  return [
    field('links', 'url', 'LinkedIn profile URL', {}, 'https://www.linkedin.com/in/your-name'),
    field('links', 'url', 'GitHub profile URL', {}, 'https://github.com/your-username'),
    field('links', 'url', 'GitHub repository URL', {}, 'A project you want reviewers to see'),
    field('links', 'url', 'Portfolio / personal website', {}, 'https://your-site.com'),
    field('links', 'url', 'Other link (Dribbble, Behance, blog…)'),

    field('contact', 'phone', 'Phone number'),

    field('comp', 'salary', 'Desired salary', {}, 'Annual amount; add a maximum to get range formats'),

    field('dates', 'date', 'Available start date'),
    field('dates', 'date', "Today's date (for signatures)", { today: true }),
    field('dates', 'date', 'Graduation date'),

    field('letters', 'long', 'Cover letter', {},
      'Dear {{hiringManager}},\n\nI am excited to apply for {{position}} at {{company}}. …\n\nSincerely,\nYour Name'),
    field('letters', 'long', 'Professional summary / About me'),
    field('letters', 'long', 'Why do you want to work here?'),
    field('letters', 'long', 'Additional information'),

    field('answers', 'short', 'How did you hear about us?'),
    field('answers', 'short', 'Work authorization', {}, 'e.g. Authorized to work in the US; no sponsorship required'),
    field('answers', 'short', 'Notice period', {}, 'e.g. 2 weeks'),
    field('answers', 'short', 'Years of experience'),
    field('answers', 'short', 'Willing to relocate?'),
    field('answers', 'short', 'Pronouns'),
  ]
}

// ---------- Job details ----------

/** Generic stand-ins used when a job detail is left blank. */
export const GENERIC_JOB_DETAILS = {
  company: 'your organization',
  position: 'the advertised position',
  hiringManager: 'Hiring Manager',
}

export const blankJobDetails = () => Object.fromEntries(JOB_DETAIL_FIELDS.map(({ key }) => [key, '']))

export function defaultState() {
  return {
    version: STATE_VERSION,
    theme: 'light',
    // How the Use page shows fields: 'values' (full rows) or 'buttons' (icon and label only).
    useView: 'values',
    sections: defaultSections(),
    fields: defaultFields(),
    jobDetails: blankJobDetails(),
    jobDetailDefaults: { ...GENERIC_JOB_DETAILS },
  }
}
