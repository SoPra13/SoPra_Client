/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.password = null;
    this.avatar = null;
    this.userToken = null;
    this.lobbyToken = null;
    this.gameToken = null;
    this.status = null;
    this.voted = null;
    this.gaveClue = null;
    this.unityReady = null;
    this.ready = null;
    this.word = null;
    this.gamesPlayed = null;
    this.guessesMade = null;
    this.guessesCorrect = null;
    this.invalidClues = null;
    this.totalClues = null;
    this.duplicateClues = null;
    this.totalScore = null;

    Object.assign(this, data);
  }
}
export default User;
