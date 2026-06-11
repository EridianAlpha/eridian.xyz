const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const

/** Parse YYYY-MM-DD as local calendar date — stable across Node, Safari, and Chrome. */
export function parseCardDate(dateStr: string | undefined | null): Date | null {
    if (!dateStr) return null
    const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(dateStr.trim())
    if (!match) return null

    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    if (month < 1 || month > 12 || day < 1 || day > 31) return null

    return new Date(year, month - 1, day)
}

/** Stable date labels for SSR — avoids locale differences and inconsistent `Date` parsing. */
export function formatDisplayDate(date: Date | string | null | undefined): string {
    const parsed = typeof date === "string" ? parseCardDate(date) : date
    if (!parsed || Number.isNaN(parsed.getTime())) return "—"

    return `${parsed.getDate()} ${MONTHS_SHORT[parsed.getMonth()]} ${parsed.getFullYear()}`
}
