import {
  db,
} from './database'

import type {
  TaskRecord,
} from './database'


/* =====================================================
   CREATE TASK
===================================================== */

export async function createTask(
  title: string,
  dueAt: string,
) {
  const now =
    new Date().toISOString()

  const task: TaskRecord = {
    id:
      crypto.randomUUID(),

    title:
      title.trim(),

    dueAt,

    completed:
      false,

    createdAt:
      now,

    updatedAt:
      now,

    reminderSent:
      false,
  }

  await db.tasks.add(
    task,
  )

  return task
}


/* =====================================================
   UPDATE TASK
===================================================== */

export async function updateTask(
  id: string,
  title: string,
  dueAt: string,
) {
  const existing =
    await db.tasks.get(id)

  if (!existing) {
    return
  }

  /*
   * If the deadline changes,
   * allow the 3-hour reminder
   * to happen again.
   */

  const deadlineChanged =
    existing.dueAt !== dueAt

  await db.tasks.update(
    id,
    {
      title:
        title.trim(),

      dueAt,

      updatedAt:
        new Date().toISOString(),

      ...(deadlineChanged
        ? {
            reminderSent:
              false,
          }
        : {}),
    },
  )
}


/* =====================================================
   COMPLETE / UNCOMPLETE
===================================================== */

export async function toggleTask(
  id: string,
) {
  const task =
    await db.tasks.get(id)

  if (!task) {
    return
  }

  const now =
    new Date().toISOString()

  /*
   * Completing a task:
   * save the exact completion time.
   *
   * Uncompleting:
   * remove completedAt.
   */

  await db.tasks.update(
    id,
    {
      completed:
        !task.completed,

      completedAt:
        task.completed
          ? undefined
          : now,

      updatedAt:
        now,
    },
  )
}


/* =====================================================
   DELETE TASK
===================================================== */

export async function deleteTask(
  id: string,
) {
  await db.tasks.delete(
    id,
  )
}


/* =====================================================
   GET TASKS
===================================================== */

export async function getTasks() {
  return db.tasks
    .orderBy('dueAt')
    .toArray()
}


/* =====================================================
   MARK REMINDER SENT
===================================================== */

export async function markReminderSent(
  id: string,
) {
  await db.tasks.update(
    id,
    {
      reminderSent:
        true,

      updatedAt:
        new Date().toISOString(),
    },
  )
}