class Bot {
    constructor(data = {}) {
        this.id = null;
        this.botName = null;
        this.password = null;
        this.botToken = null;
        this.lobbyToken = null;
        this.gameToken = null;
        this.status = null;
        this.gaveClue = null;
        this.unityReady = true;
        this.avatar = null;
        this.ready = null; // READY, PREPARING
        this.word = null;
        this.difficulty = null;
        Object.assign(this, data);
    }
}
export default Bot;