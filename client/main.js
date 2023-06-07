import { Game } from './game.js';
import { multiPlayerView, getPlayerName } from './multiplayer.js';
import { Rack } from './rack.js';
import * as utils from './scrabbleUtils.js';
import {
  wordScoreBoard,
  gameScoreBoard,
  topWordAndGameScoreBoard,
} from './scoreboard.js';

const boardGridElement = document.getElementById('board');
const playersElement = document.getElementById('players');
const wordElement = document.getElementById('word');
const xElement = document.getElementById('x');
const yElement = document.getElementById('y');
const directionElement = document.getElementById('direction');
const playButtonElement = document.getElementById('play');
const resetButtonElement = document.getElementById('reset');
const helpButtonElement = document.getElementById('help');
const hintElement = document.getElementById('hint');


const TILE_COUNT = 7;
const NUMBER_OF_PLAYERS = 2;

// Keeps track of scores
const scores = Array.from(Array(NUMBER_OF_PLAYERS), () => 0);

// A function to setup multiple racks for a multi-player game.
const setUpRacks = (game, tileCount, numberOfPlayers) => {
  const racks = [];
  for (let i = 0; i < numberOfPlayers; i++) {
    const rack = new Rack();
    rack.takeFromBag(tileCount, game);
    racks[i] = rack;
  }
  return racks;
};

// A utility function to keep a circular counter.
const circularCounter = (end) => {
  let current = 0;
  return () => {
    current = (current + 1) % end;
    return current;
  };
};

// Creates and renders the game.
const game = new Game();
game.render(boardGridElement);

// Creates the racks.
const racks = setUpRacks(game, TILE_COUNT, NUMBER_OF_PLAYERS);
let nextTurn = circularCounter(NUMBER_OF_PLAYERS);
let turn = 0;

// Create and render the multiplayer view and racks.
multiPlayerView(playersElement, racks, turn);


playButtonElement.addEventListener('click', () => {
  // Gets the values from the UI elements.
  const word = wordElement.value;
  const x = parseInt(xElement.value);
  const y = parseInt(yElement.value);
  const direction = directionElement.value === 'horizontal';

  // Used to record the score of the current move.
  let score = 0;

  // Gets the available tiles from the player's rack
  const tiles = racks[turn].getAvailableTiles();

  const wordIsValid = (w) =>
    utils.canConstructWord(tiles, w) && utils.isValid(w);

  const wordIsNotValid = (w) => !wordIsValid(w);

  const playAt = (rw, { x, y }, d) => {
    score = game.playAt(rw, { x, y }, d);
    if (score !== -1) {
      scores[turn] += score;
    }
  };

  // Determines if a play of the word w with direction d is successful.
  const playFails = (w, d) => {
    const rw = utils.constructWord(tiles, w).join('');
    return playAt(rw, { x, y }, d) === -1;
  };

  if (wordIsNotValid(word)) {
    alert(`The word ${word} cannot be constructed.`);
  } else if (wordIsValid(word) && playFails(word, direction)) {
    alert(`The word ${word} cannot be played at that location.`);
  } else {
    
    game.render(boardGridElement);

    // Updates the player's rack by removing the used tiles.
    const used = utils.constructWord(tiles, word);
    used.forEach((tile) => racks[turn].removeTile(tile));

    // Takes more tiles from the bag to fill the rack.
    racks[turn].takeFromBag(used.length, game);

    // Saves and display the word score.
  
    turn = nextTurn();
    multiPlayerView(playersElement, racks, turn);

    // Clears out UI elements for the next play.
    wordElement.value = '';
    xElement.value = '';
    yElement.value = '';
    hintElement.innerHTML = '';
  }
});

resetButtonElement.addEventListener('click', () => {
  // Resets the game board.
  game.reset();
  game.render(boardGridElement);

  // Resets the racks.
  racks.forEach((rack) => rack.reset());
  racks.forEach((rack) => rack.takeFromBag(TILE_COUNT, game));

  // Resets the turn and next turn counter function.
  nextTurn = circularCounter(racks.length);
  turn = 0;

  // Resets the multiplayer view.
  multiPlayerView(playersElement, racks, turn, true);
});

helpButtonElement.addEventListener('click', () => {
  const tiles = racks[turn].getAvailableTiles();
  const possibilities = utils.bestPossibleWords(tiles);
  const hint =
    possibilities.length === 0
      ? 'no words!'
      : possibilities[Math.floor(Math.random() * possibilities.length)];
  hintElement.innerText = hint;
});

