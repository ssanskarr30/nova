import {
  useMemo,
  useState,
} from 'react'

import {
  ArrowLeft,
  FileText,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'

import {
  useLiveQuery,
} from 'dexie-react-hooks'

import {
  db,
} from '../db/database'

import {
  createNote,
  deleteNote,
  updateNote,
} from '../db/notes'

import {
  useNavigate,
} from 'react-router-dom'


/* =====================================================
   DATE
===================================================== */

function formatNoteDate(
  dateString: string,
) {

  return new Date(
    dateString,
  ).toLocaleDateString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  )
}


/* =====================================================
   NOTES PAGE
===================================================== */

function Notes() {

  const navigate =
    useNavigate()


  /* ===============================================
     SEARCH
  =============================================== */

  const [
    search,
    setSearch,
  ] = useState('')


  /* ===============================================
     EDITOR
  =============================================== */

  const [
    editorOpen,
    setEditorOpen,
  ] = useState(false)


  const [
    editingId,
    setEditingId,
  ] = useState<
    string | null
  >(null)


  const [
    title,
    setTitle,
  ] = useState('')


  const [
    content,
    setContent,
  ] = useState('')


  /* ===============================================
     LIVE NOTES
  =============================================== */

  const notes =
    useLiveQuery(
      () =>
        db.notes
          .orderBy('updatedAt')
          .reverse()
          .toArray(),
      [],
      [],
    )


  /* ===============================================
     SEARCHED NOTES
  =============================================== */

  const filteredNotes =
    useMemo(
      () => {

        const query =
          search
            .trim()
            .toLowerCase()

        if (!query) {
          return notes
        }

        return notes.filter(
          (note) =>
            note.title
              .toLowerCase()
              .includes(query) ||
            note.content
              .toLowerCase()
              .includes(query),
        )
      },
      [
        notes,
        search,
      ],
    )


  /* ===============================================
     OPEN NEW NOTE
  =============================================== */

  function openNewNote() {

    setEditingId(null)

    setTitle('')

    setContent('')

    setEditorOpen(true)
  }


  /* ===============================================
     OPEN EXISTING NOTE
  =============================================== */

  function openNote(
    id: string,
  ) {

    const note =
      notes.find(
        (item) =>
          item.id === id,
      )

    if (!note) {
      return
    }

    setEditingId(
      note.id,
    )

    setTitle(
      note.title,
    )

    setContent(
      note.content,
    )

    setEditorOpen(true)
  }


  /* ===============================================
     CLOSE EDITOR
  =============================================== */

  function closeEditor() {

    setEditorOpen(false)

    setEditingId(null)

    setTitle('')

    setContent('')
  }


  /* ===============================================
     SAVE NOTE
  =============================================== */

  async function handleSave() {

    if (
      !title.trim() &&
      !content.trim()
    ) {
      closeEditor()
      return
    }


    if (editingId) {

      await updateNote(
        editingId,
        title,
        content,
      )

    } else {

      await createNote(
        title,
        content,
      )
    }


    closeEditor()
  }


  /* ===============================================
     DELETE NOTE
  =============================================== */

  async function handleDelete() {

    if (!editingId) {
      return
    }

    await deleteNote(
      editingId,
    )

    closeEditor()
  }


  /* ===============================================
     RENDER
  =============================================== */

  return (
    <div className="page notes-page">

      {/* =============================================
          HEADER
      ============================================= */}

      <header className="page-header">

        <div className="notes-header-left">

          <button
            className="notes-back-button"
            onClick={() =>
              navigate('/more')
            }
            aria-label="Back"
          >
            <ArrowLeft
              size={18}
            />
          </button>


          <div>

            <p className="eyebrow">
              PERSONAL
            </p>

            <h1>
              Notes
            </h1>

          </div>

        </div>


        <button
          className="notes-add-button"
          onClick={
            openNewNote
          }
          aria-label="New note"
        >
          <Plus
            size={20}
          />
        </button>

      </header>


      {/* =============================================
          SEARCH
      ============================================= */}

      <div className="notes-search">

        <Search
          size={17}
        />

        <input
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value,
            )
          }
          placeholder="Search notes..."
          type="text"
        />

        {search && (
          <button
            onClick={() =>
              setSearch('')
            }
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}

      </div>


      {/* =============================================
          NOTES
      ============================================= */}

      {filteredNotes.length ===
      0 ? (

        <div className="notes-empty">

          <div className="notes-empty-icon">

            <FileText
              size={23}
            />

          </div>

          <h2>
            {search
              ? 'No notes found'
              : 'Your notes are empty'}
          </h2>

          <p>
            {search
              ? 'Try a different search.'
              : 'Save ideas, revision points, reminders and anything important here.'}
          </p>

          {!search && (
            <button
              className="notes-empty-button"
              onClick={
                openNewNote
              }
            >
              <Plus size={16} />
              Create your first note
            </button>
          )}

        </div>

      ) : (

        <div className="notes-list">

          {filteredNotes.map(
            (note) => {

              const preview =
                note.content
                  .replace(
                    /\n/g,
                    ' ',
                  )
                  .trim()


              return (

                <button
                  key={note.id}
                  className="note-card"
                  onClick={() =>
                    openNote(
                      note.id,
                    )
                  }
                >

                  <div className="note-card-icon">

                    <FileText
                      size={18}
                    />

                  </div>


                  <div className="note-card-content">

                    <div className="note-card-title-row">

                      <h2>
                        {note.title ||
                          'Untitled Note'}
                      </h2>

                      <span>
                        {formatNoteDate(
                          note.updatedAt,
                        )}
                      </span>

                    </div>


                    <p>
                      {preview ||
                        'No content'}
                    </p>

                  </div>

                </button>

              )
            },
          )}

        </div>

      )}


      {/* =============================================
          EDITOR
      ============================================= */}

      {editorOpen && (

        <div
          className="note-editor-overlay"
          onMouseDown={closeEditor}
        >

          <div
            className="note-editor"
            onMouseDown={(
              event,
            ) =>
              event.stopPropagation()
            }
          >

            {/* EDITOR HEADER */}

            <div className="note-editor-header">

              <div>

                <span className="section-overline">
                  {editingId
                    ? 'EDIT NOTE'
                    : 'NEW NOTE'}
                </span>

                <h2>
                  {editingId
                    ? 'Edit your note'
                    : 'Write something'}
                </h2>

              </div>


              <button
                className="modal-close"
                onClick={
                  closeEditor
                }
                aria-label="Close"
              >
                <X size={19} />
              </button>

            </div>


            {/* TITLE */}

            <input
              className="note-title-input"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value,
                )
              }
              placeholder="Note title"
              autoFocus
            />


            {/* CONTENT */}

            <textarea
              className="note-content-input"
              value={content}
              onChange={(event) =>
                setContent(
                  event.target.value,
                )
              }
              placeholder="Start writing..."
            />


            {/* ACTIONS */}

            <div className="note-editor-actions">

              {editingId && (
                <button
                  className="note-delete-button"
                  onClick={
                    handleDelete
                  }
                >
                  <Trash2
                    size={16}
                  />

                  Delete
                </button>
              )}


              <div className="note-editor-right">

                <button
                  className="note-cancel-button"
                  onClick={
                    closeEditor
                  }
                >
                  Cancel
                </button>

                <button
                  className="note-save-button"
                  onClick={
                    handleSave
                  }
                >
                  Save note
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}


export default Notes