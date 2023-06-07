class WordScoreBoard {
  constructor() {
    this.words = [];
  }

  async saveWordScore(name, word, score) {
    this.words.push({ name, word, score });
    await fetch('/wordScore', {
      method: 'POST',
      body: JSON.stringify({ name, word, score }),
    });
  }

  
  render(element) {
    let html = '<h1>Word Scores</h1>';
    html += '<table>';
    this.words.forEach((word) => {
      html += `
        <tr>
          <td>${word.name}</td>
          <td>${word.word}</td>
          <td>${word.score}</td>
        </tr>
      `;
    });
    html += '</table>';
    element.innerHTML = html;
  }
}

class GameScoreBoard {
  constructor() {
    this.game = [];
  }

  render(element) {
    let html = '<h1>Game Score</h1>';
    html += '<table>';
    this.game.forEach((word) => {
      html += `
        <tr>
          <td>${word.name}</td>
          <td>${word.score}</td>
        </tr>
      `;
    });
    html += '</table>';
    element.innerHTML = html;
  }

  async saveGameScore(name, score) {
    this.game.push({ name, score });
    await fetch('/gameScore', {
      method: 'POST',
      body: JSON.stringify({ name, score }),
    });
  }
}

class TopWordAndGameScoreBoard {
  async render(element) {
    const response = await fetch('/highestWordScores');
    const wordScores = await response.json();

    const g_resp = await fetch('/highestGameScores');
    const gameScores = await g_resp.json();

    let html = '';

    html += '<h2>Top Word Scores</h2>';
    html += '<table>';
    wordScores.forEach((score) => {
      html += `
        <tr>
          <td>${score.name}</td>
          <td>${score.word}</td>
          <td>${score.score}</td>
        </tr>
      `;
    });
    html += '</table>';

    html += '<h2>Top Game Scores</h2>';
    html += '<table>';
    gameScores.forEach((score) => {
      html += `
        <tr>
          <td>${score.name}</td>
          <td>${score.score}</td>
        </tr>
      `;
    });
    html += '</table>';

    element.innerHTML = html;
  
  }
}

export const wordScoreBoard = new WordScoreBoard();
export const gameScoreBoard = new GameScoreBoard();
export const topWordAndGameScoreBoard = new TopWordAndGameScoreBoard();
