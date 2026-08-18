import {
  markReminderSent,
} from '../db/tasks'

import type {
  TaskRecord,
} from '../db/database'


/* =====================================================
   REQUEST PERMISSION
===================================================== */

export async function requestNotificationPermission() {
  if (
    typeof Notification ===
    'undefined'
  ) {
    return false
  }

  if (
    Notification.permission ===
    'granted'
  ) {
    return true
  }

  if (
    Notification.permission ===
    'denied'
  ) {
    return false
  }

  const permission =
    await Notification.requestPermission()

  return (
    permission ===
    'granted'
  )
}


/* =====================================================
   SEND NOTIFICATION
===================================================== */

export function sendNotification(
  title: string,
  body: string,
) {
  if (
    typeof Notification ===
    'undefined'
  ) {
    return
  }

  if (
    Notification.permission !==
    'granted'
  ) {
    return
  }

  new Notification(
    title,
    {
      body,
      icon: '/favicon.ico',
    },
  )
}


/* =====================================================
   CHECK TASK REMINDERS
===================================================== */

export async function checkTaskReminders(
  tasks: TaskRecord[],
) {
  const now =
    Date.now()

  const THREE_HOURS =
    3 * 60 * 60 * 1000

  for (
    const task of tasks
  ) {
    if (
      task.completed ||
      task.reminderSent
    ) {
      continue
    }

    const due =
      new Date(
        task.dueAt,
      ).getTime()

    const remaining =
      due - now

    /*
     * Send reminder when:
     *
     * <= 3 hours remaining
     * AND
     * deadline has not passed.
     */
    if (
      remaining > 0 &&
      remaining <=
        THREE_HOURS
    ) {
      const permission =
        await requestNotificationPermission()

      if (!permission) {
        continue
      }

      const hours =
        Math.floor(
          remaining /
            (60 * 60 * 1000),
        )

      const minutes =
        Math.floor(
          (
            remaining %
              (60 * 60 * 1000)
          ) /
            (60 * 1000),
        )

      let remainingText =
        ''

      if (
        hours > 0
      ) {
        remainingText +=
          `${hours}h `
      }

      remainingText +=
        `${minutes}m`

      sendNotification(
        'NOVA • Task reminder',
        `"${task.title}" is still pending — ${remainingText} left.`,
      )

      await markReminderSent(
        task.id,
      )
    }
  }
}