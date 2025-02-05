import {useState, useEffect} from 'react'
import './App.css'

const getRandomWord = () => {
  const words = [
    'apple',
    'grape',
    'table',
    'chair',
    'spine',
    'plant',
    'horse',
    'dream',
    'light',
    'cloud',
  ]
  return words[Math.floor(Math.random() * words.length)]
}

const validateGuess = (guess, targetWord) => {
  return guess.split('').map((letter, index) => {
    if (letter === targetWord[index]) return 'green'
    if (targetWord.includes(letter)) return 'yellow'
    return 'gray'
  })
}

const MAX_ATTEMPTS = 5

const App = () => {
  const [targetWord, setTargetWord] = useState(getRandomWord())
  const [guesses, setGuesses] = useState([])
  const [input, setInput] = useState('')
  const [gameStatus, setGameStatus] = useState('playing')
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.body.className = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleGuess = () => {
    if (input.length !== 5 || gameStatus !== 'playing') return

    const feedback = validateGuess(input, targetWord)
    setGuesses([...guesses, {word: input, feedback}])
    setInput('')

    if (input === targetWord) {
      setGameStatus('won')
    } else if (guesses.length + 1 >= MAX_ATTEMPTS) {
      setGameStatus('lost')
    }
  }

  const resetGame = () => {
    setTargetWord(getRandomWord())
    setGuesses([])
    setInput('')
    setGameStatus('playing')
  }

  const handleDelete = () => setInput(input.slice(0, -1))
  const handleClear = () => setInput('')
  const handleKeyPress = event => event.key === 'Enter' && handleGuess()

  return (
    <div className={`game-container ${theme}`}>
      <h1>Wordle Clone</h1>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>
      <button className="new-game-btn" onClick={resetGame}>
        🔄 New Game
      </button>

      <div className="grid">
        {Array.from({length: MAX_ATTEMPTS}).map((_, rowIndex) => (
          <div className="row" key={rowIndex}>
            {Array.from({length: 5}).map((_, colIndex) => {
              const guess = guesses[rowIndex]
              const letter = guess ? guess.word[colIndex] : ''
              const color = guess ? guess.feedback[colIndex] : 'empty'
              return (
                <div className={`cell ${color}`} key={colIndex}>
                  {letter.toUpperCase()}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {gameStatus === 'playing' ? (
        <div className="keyboard">
          <input
            type="text"
            maxLength="5"
            value={input}
            onChange={e => setInput(e.target.value.toLowerCase())}
            onKeyDown={handleKeyPress}
            placeholder="Enter a 5-letter word"
          />
          <div className="button-group">
            <button onClick={handleGuess}>Submit</button>
            <button onClick={handleDelete}>⌫ Delete</button>
            <button className="clear-btn" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      ) : (
        <div className="game-message">
          <p>
            {gameStatus === 'won'
              ? '🎉 You Win!'
              : `❌ Game Over! The word was "${targetWord}"`}
          </p>
        </div>
      )}
    </div>
  )
}

export default App
