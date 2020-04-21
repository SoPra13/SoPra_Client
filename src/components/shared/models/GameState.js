class GameState {
    constructor(data = {}) {
        this.id = null;
        this.version = null;
        this.token = null;
        this.currentRound = null;
        this.guesser = null;
        this.guessList = null;
        this.mysteryWords = null;
        this.voteList = null;
        this.playerList = null;
        this.botList = null;

        this.wordList = null;
        this.status = null;
        this.adminToken = null;
        this.playerList = null; //array of users
        this.botList = null;
        this.numberOfPlayer = null; // number of Player (3-7)
        this.lobbyState = null; // OPEN, INGAME, OFFLINE(if offline, then delete)
        this.lobbyType = null; // PUBLIC; PRIVATE
        this.playerList = null; // list of tokens of joined players
        Object.assign(this, data);
    }
}
export default GameState;
