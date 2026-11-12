// An icon for each field, used by the Use page's button view.
import {
  mdiLinkedin, mdiGithub, mdiGitlab, mdiStackOverflow, mdiTwitter, mdiWeb, mdiLinkVariant,
  mdiPhoneOutline, mdiCashMultiple, mdiCalendarOutline, mdiTextBoxOutline, mdiFormTextbox,
} from '@mdi/js'

// Well-known sites get their own logo, matched on the URL's host name.
const SITE_ICONS = [
  { host: 'linkedin.com', icon: mdiLinkedin },
  { host: 'github.com', icon: mdiGithub },
  { host: 'gitlab.com', icon: mdiGitlab },
  { host: 'stackoverflow.com', icon: mdiStackOverflow },
  { host: 'twitter.com', icon: mdiTwitter },
  { host: 'x.com', icon: mdiTwitter },
]

const TYPE_ICONS = {
  phone: mdiPhoneOutline,
  salary: mdiCashMultiple,
  date: mdiCalendarOutline,
  long: mdiTextBoxOutline,
  short: mdiFormTextbox,
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

export function fieldIcon(field) {
  if (field.type !== 'url') return TYPE_ICONS[field.type] ?? mdiFormTextbox
  const host = hostOf(field.value?.text ?? '')
  if (!host) return mdiLinkVariant
  const site = SITE_ICONS.find((entry) => host === entry.host || host.endsWith(`.${entry.host}`))
  return site?.icon ?? mdiWeb
}
