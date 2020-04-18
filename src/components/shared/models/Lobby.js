/**
 * Lobby model
 */
class Lobby {
    constructor(data = {}) {
        this.id = null;
        this.lobbyname = null;
        this.password = null;
        this.lobbyToken = null;
        this.status = null;
        this.adminToken = null;
        this.playerList = null; //array of users, this userlist is important for the the unique usertoken + lobbytoken
        this.botList = null;
        this.numberOfPlayers = null; // number of Player (3-7)
        this.numberOfBots = null;
        this.lobbyState = null; // OPEN, INGAME, OFFLINE(if offline, then delete)
        this.lobbyType = null; // PUBLIC; PRIVATE
        this.playerList = null; // list of tokens of joined players
        Object.assign(this, data);
    }
}
export default Lobby;
