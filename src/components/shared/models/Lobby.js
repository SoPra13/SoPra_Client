/**
 * Lobby model
 */
class Lobby {
    constructor(data = {}) {
        this.id = null;
        this.lobbyname = null;
        this.password = null;
        this.token = null;
        this.status = null;
        this.numberOfPlayer = null; // number of Player (3-7)
        this.lobbyState = null; // OPEN, INGAME, OFFLINE(if offline, then delete)
        this.playerList = null; // list of tokens of joined players
        Object.assign(this, data);
    }
}
export default Lobby;
