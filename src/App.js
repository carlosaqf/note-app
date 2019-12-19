import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Note from './Components/Note'
import noteService from './services/notes'

const App = () => {

  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [newNote, setNewNote] = useState('')

  useEffect(() => {
    // axios
    //   .get('http://localhost:3001/notes')
    //   .then(response => {
    //     setNotes(response.data)
    //   })
    
    // noteService.getAll() replaces the need for axios.get(url)
    noteService
      .getAll() 
      .then(initialNotes => { 
        setNotes(initialNotes)
      })
  }, [])

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  const rows = () => notesToShow.map(note => 
    <Note
      key={note.id}
      note={note}
    />
  )
  
  const handleNoteChange = e => {
    setNewNote(e.target.value)
  }

  const toggleImportantOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important}

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note: returnedNote))
      })
      .catch(error => {
        alert(`The note ${note.content} was already deleted from the server`)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const addNote = e => {
    e.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
    }

    // axios
    //   .post('http://localhost:3001/notes', noteObject)
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  return(
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <ul>
        {rows()}
      </ul>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App;
