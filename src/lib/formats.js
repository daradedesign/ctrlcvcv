// Pure formatting helpers. Each `*Formats` function returns an array of
// { label, value } objects; the first entry is the default format.

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December']
const PLACEHOLDER_PATTERN = /\{\{\s*(\w+)\s*\}\}/g

const padNumber = (number, width = 2) => String(number).padStart(width, '0')

export const digitsOnly = (input) => String(input ?? '').replace(/\D/g, '')

// ---------- Phone ----------

export function phoneFormats({ countryCode = '1', number = '', extension = '' } = {}) {
  const country = digitsOnly(countryCode) || '1'
  const digits = digitsOnly(number)
  if (!digits) return []

  const extensionDigits = digitsOnly(extension)
  const withExtension = (formatted) => (extensionDigits ? `${formatted} ext. ${extensionDigits}` : formatted)
  const extensionOnly = extensionDigits ? [{ label: 'Extension only', value: extensionDigits }] : []

  if (digits.length === 10) {
    const [area, exchange, line] = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6)]
    return [
      { label: '(XXX) XXX-XXXX', value: withExtension(`(${area}) ${exchange}-${line}`) },
      { label: 'XXX-XXX-XXXX', value: withExtension(`${area}-${exchange}-${line}`) },
      { label: 'Digits only', value: digits },
      { label: 'E.164 (international)', value: `+${country}${digits}` },
      { label: '+CC XXX-XXX-XXXX', value: withExtension(`+${country} ${area}-${exchange}-${line}`) },
      { label: '+CC (XXX) XXX-XXXX', value: withExtension(`+${country} (${area}) ${exchange}-${line}`) },
      { label: '+CC XXX XXX XXXX', value: withExtension(`+${country} ${area} ${exchange} ${line}`) },
      { label: 'XXX.XXX.XXXX', value: withExtension(`${area}.${exchange}.${line}`) },
      { label: 'XXX XXX XXXX', value: withExtension(`${area} ${exchange} ${line}`) },
      { label: 'CC-XXX-XXX-XXXX', value: withExtension(`${country}-${area}-${exchange}-${line}`) },
      { label: 'CC + digits', value: `${country}${digits}` },
      ...extensionOnly,
    ]
  }

  // Other lengths: group digits in fours from the right.
  const grouped = digits.replace(/\B(?=(\d{4})+$)/g, ' ')
  return [
    { label: 'As entered', value: withExtension(String(number).trim()) },
    { label: 'Digits only', value: digits },
    { label: 'E.164 (international)', value: `+${country}${digits}` },
    { label: '+CC grouped', value: withExtension(`+${country} ${grouped}`) },
    { label: 'CC + digits', value: `${country}${digits}` },
    ...extensionOnly,
  ]
}

// ---------- Salary ----------

export const CURRENCIES = ['USD', 'CAD', 'EUR', 'GBP', 'AUD', 'INR', 'JPY', 'CHF', 'SEK', 'NZD', 'SGD', 'MXN', 'BRL']
export const HOURS_PER_YEAR = 2080

function formatMoney(amount, currency, { decimals = 0, withSymbol = true } = {}) {
  const options = { minimumFractionDigits: decimals, maximumFractionDigits: decimals }
  if (withSymbol) return new Intl.NumberFormat('en-US', { style: 'currency', currency, ...options }).format(amount)
  return new Intl.NumberFormat('en-US', options).format(amount)
}

/** 120000 → "$120k"; 1500000 → "$1.5M". */
function formatShort(amount, currency, withSymbol = true) {
  const short = amount >= 1e6 ? `${+(amount / 1e6).toFixed(2)}M` : `${+(amount / 1e3).toFixed(1)}k`
  if (!withSymbol) return short
  const symbol = formatMoney(0, currency).replace(/[\d.,\s]/g, '')
  return `${symbol}${short}`
}

/** amount = annual target (or bottom of the range); max = optional top of the range. */
export function salaryFormats({ amount, max, currency = 'USD' } = {}) {
  const annual = Number(amount)
  if (!annual) return []
  const rangeMax = Number(max)
  const hourly = annual / HOURS_PER_YEAR
  const money = (value, options) => formatMoney(value, currency, options)

  const formats = [
    { label: 'Plain number', value: String(Math.round(annual)) },
    { label: 'With commas', value: money(annual, { withSymbol: false }) },
    { label: 'Currency', value: money(annual) },
    { label: 'Currency + cents', value: money(annual, { decimals: 2 }) },
    { label: 'Short', value: formatShort(annual, currency) },
    { label: 'Short, no symbol', value: formatShort(annual, currency, false).toUpperCase() },
    { label: 'With currency code', value: `${money(annual, { withSymbol: false })} ${currency}` },
    { label: 'Per year', value: `${money(annual)} per year` },
    { label: 'Monthly', value: money(annual / 12) },
    { label: `Hourly (÷${HOURS_PER_YEAR} hrs)`, value: money(hourly, { decimals: 2 }) },
    { label: 'Hourly, plain number', value: hourly.toFixed(2) },
  ]

  if (rangeMax > annual) {
    const hourlyMax = rangeMax / HOURS_PER_YEAR
    formats.push(
      { label: 'Range', value: `${money(annual)} - ${money(rangeMax)}` },
      { label: 'Range, short', value: `${formatShort(annual, currency)}–${formatShort(rangeMax, currency)}` },
      { label: 'Range, plain', value: `${Math.round(annual)}-${Math.round(rangeMax)}` },
      { label: 'Range, words', value: `${money(annual)} to ${money(rangeMax)}` },
      { label: 'Range max, plain', value: String(Math.round(rangeMax)) },
      { label: 'Hourly range', value: `${money(hourly, { decimals: 2 })} - ${money(hourlyMax, { decimals: 2 })}` },
    )
  }
  return formats
}

// ---------- Dates ----------

export function todayISO() {
  const today = new Date()
  return `${today.getFullYear()}-${padNumber(today.getMonth() + 1)}-${padNumber(today.getDate())}`
}

const formatLongDate = (date) => `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`

/** iso = 'YYYY-MM-DD'; when `today` is true, today's date is used instead. */
export function dateFormats({ iso, today = false } = {}) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec((today ? todayISO() : iso) || '')
  if (!match) return []

  // Zero-padded strings ("03") and plain numbers (3) for each part.
  const [, year, month, day] = match
  const monthNumber = Number(month)
  const dayNumber = Number(day)
  const monthName = MONTH_NAMES[monthNumber - 1]
  const monthAbbr = monthName.slice(0, 3)

  return [
    { label: 'MM/DD/YYYY', value: `${month}/${day}/${year}` },
    { label: 'YYYY-MM-DD (ISO)', value: `${year}-${month}-${day}` },
    { label: 'DD/MM/YYYY', value: `${day}/${month}/${year}` },
    { label: 'M/D/YYYY', value: `${monthNumber}/${dayNumber}/${year}` },
    { label: 'MM-DD-YYYY', value: `${month}-${day}-${year}` },
    { label: 'MM/DD/YY', value: `${month}/${day}/${year.slice(2)}` },
    { label: 'DD.MM.YYYY', value: `${day}.${month}.${year}` },
    { label: 'Month D, YYYY', value: `${monthName} ${dayNumber}, ${year}` },
    { label: 'Mon D, YYYY', value: `${monthAbbr} ${dayNumber}, ${year}` },
    { label: 'D Month YYYY', value: `${dayNumber} ${monthName} ${year}` },
    { label: 'MM/YYYY', value: `${month}/${year}` },
    { label: 'Month YYYY', value: `${monthName} ${year}` },
    { label: 'YYYYMMDD', value: `${year}${month}${day}` },
  ]
}

// ---------- Text placeholders ----------

/** Job details that can be inserted into text as {{key}}. */
export const JOB_DETAIL_FIELDS = [
  { key: 'company', label: 'Company' },
  { key: 'position', label: 'Position' },
  { key: 'hiringManager', label: 'Hiring manager' },
]

export const placeholderToken = (key) => `{{${key}}}`

/**
 * Replaces {{company}}-style placeholders. A blank job detail falls back to its
 * generic default; a placeholder with neither is left as is.
 */
export function fillPlaceholders(text, jobDetails = {}, jobDetailDefaults = {}) {
  return String(text ?? '').replace(PLACEHOLDER_PATTERN, (token, key) => {
    if (key === 'date') return formatLongDate(new Date())
    return jobDetails[key]?.trim() || jobDetailDefaults[key]?.trim() || token
  })
}

/** Placeholder keys used in a piece of text, in order and without duplicates. */
export function placeholdersIn(text) {
  const keys = [...String(text ?? '').matchAll(PLACEHOLDER_PATTERN)].map((match) => match[1])
  return [...new Set(keys)]
}

/** Every copyable format for a field; the first is the default. */
export function fieldFormats(field, jobDetails, jobDetailDefaults) {
  const value = field.value ?? {}
  switch (field.type) {
    case 'phone': return phoneFormats(value)
    case 'salary': return salaryFormats(value)
    case 'date': return dateFormats(value)
    default: {
      const text = fillPlaceholders(value.text, jobDetails, jobDetailDefaults)
      return text ? [{ label: 'Text', value: text }] : []
    }
  }
}
