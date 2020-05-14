/**
 * Lobby model
 */
class Lobby {
    constructor(data = {}) {
        this.id = null;
        this.lobbyName = null;
        this.lobbyToken = null;
        this.lobbyState = null; // OPEN, INGAME, OFFLINE(if offline, then delete)
        this.lobbyType = null; // PUBLIC; PRIVATE
        this.numberOfPlayers = null; // number of Player (3-7)
        this.adminToken = null;
        this.joinToken = null;
        this.playerList = null; //array of users, this userlist is important for the the unique usertoken + lobbytoken
        this.botList = null;
        Object.assign(this, data);
    }
}
export default Lobby;
