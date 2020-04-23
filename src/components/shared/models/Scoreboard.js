class Scoreboard {
constructor(data = {}) {
    this.id = null;
    this.playerList=null;
    this.teamScore=null;
    this.lobbyname = null;
    this.botList = null;
    Object.assign(this, data);
}
}
export default Scoreboard;