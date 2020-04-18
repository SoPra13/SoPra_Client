/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.password = null;
    this.color = null;
    this.userToken = null;
    this.lobbyToken = null;
    this.gameToken = null;
    this.status = null;
    this.score = null;
    this.ready = null; // READY, PREPARING
    this.currentPosition = null; // (int 1-7)
    this.memberIs = null; // ADMIN or PLAYER in the lobby
    this.gamePos = null;  // current position in the game for the rotation
    this.word = null;
    Object.assign(this, data);
  }
}
export default User;
