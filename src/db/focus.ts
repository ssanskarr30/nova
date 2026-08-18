import {
  db,
} from './database'


/* =====================================================
   SAVE FOCUS SESSION
===================================================== */

export async function saveFocusSession(
  subject: string,
  startedAt: string,
  endedAt: string,
  durationMs: number,
) {
  await db.focusSessions.add({
    id:
      crypto.randomUUID(),

    subject,

    startedAt,

    endedAt,

    durationMs,
  })
}


/* =====================================================
   GET TOTAL FOCUS TIME
===================================================== */

export async function getTotalFocusTime() {
  const sessions =
    await db.focusSessions.toArray()

  return sessions.reduce(
    (
      total,
      session,
    ) =>
      total +
      session.durationMs,
    0,
  )
}


/* =====================================================
   GET TODAY'S FOCUS TIME
===================================================== */

export async function getTodayFocusTime() {
  const today =
    new Date()

  const year =
    today.getFullYear()

  const month =
    String(
      today.getMonth() + 1,
    ).padStart(2, '0')

  const day =
    String(
      today.getDate(),
    ).padStart(2, '0')

  const prefix =
    `${year}-${month}-${day}`

  const sessions =
    await db.focusSessions.toArray()

  return sessions
    .filter(
      (session) =>
        session.startedAt.startsWith(
          prefix,
        ),
    )
    .reduce(
      (
        total,
        session,
      ) =>
        total +
        session.durationMs,
      0,
    )
}