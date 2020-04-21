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
    this.voted = null;
    this.unityReady = null;
    this.score = null;
    this.ready = null; // READY, PREPARING
    this.word = null;
    Object.assign(this, data);
  }
}
export default User;
