import { useState } from 'react'
import languages from "./languages.js"
import classnames from "classnames"
import { getFarewellText, getRandomWord, loadConfettiEffect } from './utils.js'

/*
  - farewell messages in status section ✅
  - block letters when game is over ✅
  - accessibility issues ✅
  - make new game button work ✅
  - choose a random word from a list (or allow user input?) ✅
  - reveal word when game lost ✅
  - confetti when user wins
*/


export default function Hangman() {

  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [usedLetters, setUsedLetters] = useState([])

  const numGuessesLeft = languages.length - 1

  const wrongGuessCount = 
    usedLetters.filter(letter => !currentWord.includes(letter)).length

  const isGameWon = 
    currentWord.split("").every(letter => usedLetters.includes(letter))

  if (isGameWon) {
    loadConfettiEffect()
  }

  const isGameLost = 
    wrongGuessCount >= numGuessesLeft

  const isGameOver = isGameWon || isGameLost

  const lastGuessedLetter = usedLetters[usedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  const gameStatusClass = classnames({
    status: true,
    gamewon: isGameWon,
    gamelost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect,
  })

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="farewell-message">{getFarewellText(languages[wrongGuessCount - 1].name)}</p>
      )
    }

    if (isGameWon) {
      return (
        <>
          <h3>You Win!</h3>
          <p>Well Done! 🎉</p>
        </>
      )
    }

    if (isGameLost) {
      return (
        <>
          <h3>Game Over!</h3>
          <p>You Lose! Better start learning Assembly 😭</p>
        </>
      )
    }
  }
    

  function selectLetter(newLetter) {
    setUsedLetters(prevLetters => 
      prevLetters.includes(newLetter) ?
      prevLetters :
      [...prevLetters, newLetter]
    )
  }

  const languagesArray = languages.map((language, index) => {
    const isLangLost = index < wrongGuessCount
    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    }
    const classNames = classnames({
      language: true,
      lost: isLangLost,
    })
    return (
      <span key={index} className={classNames} style={styles}>
        {language.name}
      </span>
    )
  })
  
  const wordDisplay = currentWord.split("").map((character, index) => {
    // need to onyl display the correctly guessed letters -> use classnames
    const classNames = classnames({
      letterbox: true,
      letternotguessed: isGameLost && !usedLetters.includes(character),
      letterguessed: isGameLost && usedLetters.includes(character),
      letterwon: isGameWon,
    })
    if (isGameLost) {
      return (
        <span key={index} className={classNames}>
          {character.toUpperCase()}
        </span>
      )
    } else {
      return (
        <span key={index} className={classNames}>
          {usedLetters.includes(character) ? character.toUpperCase() : ""}
        </span>
      )
    }
  })

  const alphabet = "qwertyuiopasdfghjklzxcvbnm"

  const keyboard = alphabet.split("").map(character => {

    // assigns new classes to keys which have been guessed (right/wrong)
    const keyClassName = classnames({
      keys: true,
      keyright: usedLetters.includes(character) && currentWord.includes(character),
      keywrong: usedLetters.includes(character) && !currentWord.includes(character),
    })
    return (
      // remember onClick requires a callback function to work correctly
      <button 
        key={character} 
        className={keyClassName}
        onClick={() => selectLetter(character)}
        disabled={isGameOver || usedLetters.includes(character)}
        aria-disabled={usedLetters.includes(character)}
        aria-label={`letter ${character}`}
      >
        {character.toUpperCase()}
      </button>
    )
  })

  function resetGame() {
    setCurrentWord(getRandomWord())
    setUsedLetters([])
  }


  
  const newGameButton = isGameOver ? <button onClick={() => resetGame()}>New Game</button> : null

  return (
    <main>

      <header className="header">
        <h1>Hangman</h1>
        <h2>Guess the word in under 8 attempts to save all the programming languages from annihilation</h2>
      </header>

      <section 
        aria-live="polite" 
        role="status" 
        className={gameStatusClass}
      >
        {renderGameStatus()}
      </section>

      <section className="languages">
        {languagesArray}
      </section>

      <section className="word-display">
        {wordDisplay}
      </section>

      {/* hidden aria-live section for accessibility and status updates */}
      <section 
        className="sr-only"
        aria-live="polite"
        role="status"
      > 
        <p>
          {currentWord.includes(lastGuessedLetter) ?
            `Correct! The letter ${lastGuessedLetter} is in the word` :
            `Sorry, the letter ${lastGuessedLetter} is not in the word`  
          }
          You have {numGuessesLeft} attempts left
        </p>
        <p>Current word: {currentWord.split("").map(letter =>
            usedLetters.includes(letter) ? letter + "." : "blank.").join(" ")}
        </p>
      </section>

      <section className="keyboard">
        {keyboard}
      </section>

      <section className="newgame-button">
        {newGameButton}
      </section>
      
    </main>
  )
}
