import {
  db,
} from './database'

import type {
  NoteRecord,
} from './database'


/* =====================================================
   CREATE NOTE
===================================================== */

export async function createNote(
  title: string,
  content: string,
) {

  const now =
    new Date().toISOString()

  const note: NoteRecord = {
    id:
      crypto.randomUUID(),

    title:
      title.trim() || 'Untitled Note',

    content,

    createdAt:
      now,

    updatedAt:
      now,
  }

  await db.notes.add(note)

  return note
}


/* =====================================================
   UPDATE NOTE
===================================================== */

export async function updateNote(
  id: string,
  title: string,
  content: string,
) {

  const existing =
    await db.notes.get(id)

  if (!existing) {
    return
  }

  await db.notes.update(
    id,
    {
      title:
        title.trim() ||
        'Untitled Note',

      content,

      updatedAt:
        new Date().toISOString(),
    },
  )
}


/* =====================================================
   DELETE NOTE
===================================================== */

export async function deleteNote(
  id: string,
) {

  await db.notes.delete(id)
}


/* =====================================================
   GET ONE NOTE
===================================================== */

export async function getNote(
  id: string,
) {

  return db.notes.get(id)
}


/* =====================================================
   GET ALL NOTES
===================================================== */

export async function getNotes() {

  return db.notes
    .orderBy('updatedAt')
    .reverse()
    .toArray()
}