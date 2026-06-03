// lib/ical.ts
import { prisma } from './prisma'

interface ParsedEvent {
  uid: string
  start: Date
  end: Date
  summary: string
}

/**
 * Parse a date string from an iCal DATE value (YYYYMMDD) to a Date at midnight.
 */
function parseIcalDate(dateStr: string): Date {
  const year = parseInt(dateStr.substring(0, 4), 10)
  const month = parseInt(dateStr.substring(4, 6), 10) - 1
  const day = parseInt(dateStr.substring(6, 8), 10)
  const d = new Date(year, month, day)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Fetch and parse an iCal feed URL, returning VEVENTs.
 * Uses a lightweight custom parser — no external dependencies needed.
 */
export async function fetchIcalFeed(url: string): Promise<ParsedEvent[]> {
  const events: ParsedEvent[] = []

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const text = await response.text()

    // Split into VEVENT blocks
    const eventBlocks = text.split('BEGIN:VEVENT')
    // First block is before the first VEVENT (VCALENDAR header), skip it
    eventBlocks.shift()

    const now = new Date()
    now.setHours(0, 0, 0, 0)

    for (const block of eventBlocks) {
      const endIdx = block.indexOf('END:VEVENT')
      if (endIdx === -1) continue
      const eventText = block.substring(0, endIdx)

      // Extract fields using simple regex
      const uid = extractField(eventText, 'UID')
      const dtstart = extractField(eventText, 'DTSTART')
      const dtend = extractField(eventText, 'DTEND')
      const summary = extractField(eventText, 'SUMMARY')

      if (!dtstart || !dtend) continue

      // Parse DTSTART — handle both VALUE=DATE:YYYYMMDD and :YYYYMMDDTHHMMSSZ
      let start: Date
      let end: Date

      const dtstartClean = dtstart.replace(/^.*:/, '')
      const dtendClean = dtend.replace(/^.*:/, '')

      if (dtstartClean.includes('T')) {
        // Date-time format
        start = new Date(dtstartClean)
        end = new Date(dtendClean)
      } else {
        // Date-only format (YYYYMMDD)
        start = parseIcalDate(dtstartClean)
        end = parseIcalDate(dtendClean)
      }

      // Normalize to day boundaries
      start.setHours(0, 0, 0, 0)
      end.setHours(0, 0, 0, 0)

      // Skip past events
      if (end <= now) continue

      events.push({
        uid: uid || `${dtstartClean}-${dtendClean}`,
        start,
        end,
        summary: summary || 'Blocked',
      })
    }
  } catch (err) {
    console.error(`Failed to fetch iCal feed ${url}:`, err)
    throw err
  }

  return events
}

/** Extract a field value from an iCal property line. */
function extractField(text: string, fieldName: string): string | null {
  // Match "FIELDNAME;optional params:value" or "FIELDNAME:value"
  const regex = new RegExp(`^${fieldName}(?:;[^:]*)?:(.+)$`, 'm')
  const match = text.match(regex)
  if (!match) return null
  // Unescape iCal escapes: \, → ,  \; → ;  \\ → \
  return match[1]
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\')
    .trim()
}

/**
 * Sync a specific IcalSource: fetch feed, create/update bookings for that room.
 * Uses the VEVENT UID for deduplication.
 */
export async function syncIcalSource(sourceId: number): Promise<{ created: number; deleted: number; error?: string }> {
  const source = await prisma.icalSource.findUnique({ where: { id: sourceId } })
  if (!source) return { created: 0, deleted: 0, error: 'Source not found' }
  if (!source.enabled) return { created: 0, deleted: 0, error: 'Source is disabled' }

  try {
    const events = await fetchIcalFeed(source.url)

    let created = 0

    for (const event of events) {
      // Check if we already have a booking with this UID
      const existing = await prisma.booking.findFirst({
        where: { icalUid: event.uid, source: source.name },
      })

      if (!existing) {
        // Check if this date range overlaps with any manual booking (avoid duplicates)
        const overlapping = await prisma.booking.findFirst({
          where: {
            roomId: source.roomId,
            status: 'confirmed',
            checkIn: { lt: event.end },
            checkOut: { gt: event.start },
          },
        })

        if (!overlapping) {
          await prisma.booking.create({
            data: {
              roomId: source.roomId,
              checkIn: event.start,
              checkOut: event.end,
              guestName: `${source.name} (auto)`,
              status: 'confirmed',
              source: source.name,
              icalUid: event.uid,
            },
          })
          created++
        } else if (!overlapping.icalUid) {
          // Overlapping with a manual booking — don't override
          // If overlapping booking is also from iCal, we'd have found it above
        }
      }
    }

    // Remove bookings from this source that are no longer in the feed
    const currentUids = events.map(e => e.uid)
    const staleBookings = await prisma.booking.findMany({
      where: {
        source: source.name,
        roomId: source.roomId,
        icalUid: { notIn: currentUids },
        checkOut: { gte: new Date() },
      },
    })

    let deleted = 0
    for (const booking of staleBookings) {
      await prisma.booking.delete({ where: { id: booking.id } })
      deleted++
    }

    // Update lastSync timestamp
    await prisma.icalSource.update({
      where: { id: sourceId },
      data: { lastSync: new Date() },
    })

    return { created, deleted }
  } catch (err: any) {
    console.error(`Failed to sync iCal source ${source.name}:`, err)
    return { created: 0, deleted: 0, error: err.message }
  }
}

/**
 * Sync all enabled iCal sources across all rooms.
 */
export async function syncAllIcalSources(): Promise<{
  results: Array<{ name: string; created: number; deleted: number; error?: string }>
}> {
  const sources = await prisma.icalSource.findMany({ where: { enabled: true } })

  const results = []
  for (const source of sources) {
    const result = await syncIcalSource(source.id)
    results.push({ name: source.name, ...result })
  }

  return { results }
}

/**
 * Generate an iCal feed string from the local bookings.
 * This is what you give to Airbnb / Bedandbreakfast so they block
 * dates that are already booked in your system.
 */
export async function generateIcalExport(roomId?: number): Promise<string> {
  const where: any = {
    status: 'confirmed',
    checkOut: { gte: new Date() },
  }
  if (roomId) where.roomId = roomId

  const bookings = await prisma.booking.findMany({ where, orderBy: { checkIn: 'asc' } })

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cozy B&B//Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ]

  for (const booking of bookings) {
    const uid = booking.icalUid || `booking-${booking.id}@cozybnb`
    const checkIn = toIcalDate(booking.checkIn)
    const checkOut = toIcalDate(booking.checkOut)
    const summary = booking.guestName || 'Blocked'

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTART;VALUE=DATE:${checkIn}`,
      `DTEND;VALUE=DATE:${checkOut}`,
      `SUMMARY:${summary}`,
      `DTSTAMP:${toIcalDateTime(new Date())}`,
      'END:VEVENT',
    )
  }

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

/** Format a Date as an iCal DATE value (YYYYMMDD) */
function toIcalDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}${m}${d}`
}

/** Format a Date as an iCal DATE-TIME value (YYYYMMDDTHHMMSSZ) */
function toIcalDateTime(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}
