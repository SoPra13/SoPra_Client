class Bot {
    constructor(data = {}) {
        this.id = null;
        this.botname = null;
        this.password = null;
        this.color = null;
        this.botToken = null;
        this.lobbyToken = null;
        this.gameToken = null;
        this.status = null;
        this.gaveClue = null;
        this.unityReady = true;
        this.score = null;
        this.ready = null; // READY, PREPARING
        this.word = null;
        Object.assign(this, data);
    }
}
export default Bot;