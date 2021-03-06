//Unity Component in here
import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { withRouter } from 'react-router-dom';
import Unity, { UnityContent } from "react-unity-webgl";
import { api, handleError } from '../../helpers/api';
import Logo from '../login/Logo.png';

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color:   rgba(248, 248, 148, 1);
`;

const CentralRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Flex = styled.div`
    display: flex;
`;

const CentralColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;


export class UnityGame extends React.Component {
    async;


    constructor(props) {
        super(props);
        this.state = {
            lobbyToken: localStorage.getItem('lobbyToken'),
            userToken: localStorage.getItem('userToken'),
            gameToken: localStorage.getItem('gameToken'),
            initialPlayerList: null,
            round:0,
            game: null,
            playerNumber: 0,
        };

        //unityContent is our unity code accessor
        this.unityContent = new UnityContent(
            "unity_project_build/Build.json",
            "unity_project_build/UnityLoader.js"
        );

        //TODO: CHRIS remove?
        this.unityContent.on("ComTest", score =>{
            //console.log("Es funzt!" + score);
        });


        this.unityContent.on("PlayerHasConnected", () =>{
            //console.log("Unity asks for PlayerStats");
            this.setPlayerArray(this.state.game);
        });

        this.unityContent.on("FetchSubmittedClues", () =>{
            //console.log("Unity asks for the info about which player has already given a clue");
            this.sendClueReadyString(this.state.game);
        });

        this.unityContent.on("PlayerVoted", (topic) =>{
            //console.log("Unity has told Player voted for topic at position: " + topic);
            this.voteForTopic(topic);
        });

        this.unityContent.on("FetchPlayerInfo", () =>{
            //console.log("Unity asks for Player Names, Avatars & Topics");
            this.setPlayerNames(this.state.game);
            this.setPlayerAvatars(this.state.game);
            this.setTopics(this.state.game);
            this.setScores();
        });


        this.unityContent.on("FetchRound", () =>{
            //console.log("Unity asks for number of round");
            this.sendRoundNumber(this.state.game);
        });


        this.unityContent.on("FetchVotedString", () =>{
            //console.log("Unity asks for the info about which player has already voted for topic");
            this.sendPlayerHasChosenTopicInfo(this.state.game);
        });


        this.unityContent.on("FetchTopicList", () =>{
            //console.log("Unity asks for the list of given Votes");
            this.sendTopicList(this.state.game.voteList);
        });


        this.unityContent.on("LeaveGame", () =>{
            //console.log("Unity tells that player wants to leave the game");
            this.leaveGame();
        });


        this.unityContent.on("SendGuessToReact", (message) =>{
            //console.log("Unity tells player has guessed: " + message);
            this.sendGuess(message);
            this.sendRoundsTopic(this.state.game.topic);
        });

        this.unityContent.on("SendClueToReact", (message) =>{
            //console.log("Unity tells player gave clue: " + message);
            this.sendClue(message);
        });

        this.unityContent.on("SendTopicToReact", (message) =>{
            //console.log("Unity tells the topic for this round is: " + message);
            this.setTopic(message);
            this.sendRoundsTopic(message);
        });

        this.unityContent.on("TellReactToSkip", () =>{
            //console.log("Unity tells Round was skipped");
            this.sendRoundsTopic(this.state.game.topic);
        });

        this.unityContent.on("FetchCluesString", () =>{
            //console.log("Unity asks for the list of clues");
            this.sendClueList();
        });

        this.unityContent.on("FetchActivePlayerSubmittedGuess", () =>{
            //console.log("Unity asks if a guess was submitted");
            this.hasGuessed();
        });

        this.unityContent.on("TellReactToEvaluateRound", () =>{
            console.log("Unity asks what the result of submitted guess was");
            this.getResultOfGuess()
        });

        this.unityContent.on("StartNextRound", () =>{
            //console.log("Unity asks to start next round");
            this.nextRound()
        });

        this.unityContent.on("GameHasEnded", (score) =>{
            //console.log("Unity tells game has ended, score:"+score);
            this.endGame(score);
        });

        this.unityContent.on("FetchScoreStats", () =>{
            //console.log("Unity tells game has ended");
            this.sendScoreStats(this.state.game)
        });

        this.unityContent.on("UpdateScore", (score) =>{
            //do not remove
        });

        this.unityContent.on("FetchScores", () =>{
            this.setScores();
        });

    }

    /*


    END OF UNITY FUNTIONS


     */


    arrayToString(array){
        var begin = array[0];
        for (let i = 1; i < array.length; i++){
            begin += ";"+array[i];
        }
        return begin;
    }


    getIndex(game, token){
        for(var i = 0; i<game.playerList.length; i++){
            if(token == game.playerList[i].token){
                return i+1;

            }
        }
    }

    //Instantiation of the GameInfo
    async setPlayerArray(game) {

        await api.put('/game/ready?userToken=' + localStorage.getItem('userToken') + '&gameToken=' + localStorage.getItem('gameToken'));
        this.state.round = this.state.game.currentRound;
        this.state.playerListLength = this.state.game.playerList.length;


        var playerIndex = this.getIndex(game, localStorage.getItem('userToken'));
        var activePlayer = game.guesser+1;
        var totalPlayer = game.playerList.length + game.botList.length;
        var ready = game.botList.length;

        for (var i = 0; i<this.state.playerListLength; i++) {
            if (game.playerList[i].unityReady == true) {
                ready += 1;
            }
        }
        var str = '';
        str = (activePlayer.toString()+ totalPlayer.toString()+ playerIndex.toString()+ ready.toString());
        this.setPlayerStats(str);
    }


    setPlayerStats(playerStats){ //activePlayer;playerTotal;playerPosition;connectPlayers
        let infoString = playerStats;//i.e. "1726" String
        this.unityContent.send(
            "MockStats",
            "ReactSetPlayerStats",
            infoString
        )
        //console.log('PlayerStats sent to Unity: ' + infoString);
    }


    async setPlayerNames(game){ //Send a string with a ";" delimiter to unity

        var nameString = [];
        nameString = game.playerList[0].username;
        for (var i = 1; i<game.playerList.length; i++) {
            nameString += ';'+game.playerList[i].username;
        }

         for (var i = 0; i<game.botList.length; i++) {
             nameString += ';'+game.botList[i].botName;
         }

        this.unityContent.send(
            "MockStats",
            "ReactSetPlayerNames",
            nameString
        )
        //console.log("NameString sent to Unity: " + nameString);
    }


    setPlayerAvatars(){ //send a string of avatar ids to unity

        var avatarString = '';

        for(var i = 0; i<this.state.playerListLength; i++){
            avatarString += this.state.game.playerList[i].avatar.toString()
        }


        for(var i = 0; i<this.state.game.botList.length; i++){
            avatarString += this.state.game.botList[i].avatar.toString()
        }

        this.unityContent.send(
            "MockStats",
            "ReactSetPlayerAvatars",
            avatarString
        );
        //console.log("AvatarString sent to Unity: " + avatarString);
    }


    setTopics(game){ //Send a string with a ";" delimiter to unity
        let topicString = this.arrayToString(game.mysteryWords);

        this.unityContent.send(
            "MockStats",
            "ReactSetTopicArray",
            topicString
        );
        //console.log("MysteryWord sent to Unity");
    }


    setScores(){
        var scoreArray = [];
        var matched = false;

        if(this.state.initialPlayerList==null) {
            this.state.initialPlayerList = this.state.game.playerList;
        }
        //console.log(this.state.initialPlayerList);
        //console.log(this.state.game.playerList);

        // Copyright of this Kramer-ian Algorithm belongs solemnly to Marc Kramer
        for(var x = 0; x < this.state.initialPlayerList.length; x++){
            matched = false;
            for (var i = 0; i < this.state.game.playerList.length; i++) {

                if(this.state.game.playerList[i].token === this.state.initialPlayerList[x].token){
                    scoreArray.push(this.state.game.playerList[i].totalScore.toString());
                    matched=true;
                    break;
                }

            }
            if(!matched) {
                scoreArray.push(this.state.initialPlayerList[x].totalScore.toString());
            }
        }

        for(var i = 0; i<this.state.game.botList.length; i++){
            scoreArray.push(0);
        }

       var scoreString = this.arrayToString(scoreArray);

        this.unityContent.send(
            "MockStats",
            "ReactSendScoreString",
            scoreString
        );
        //console.log("ScoreString sent to Unity: " + scoreString);
    }


    sendTopicList(voteList){

        var topicListString = '';

        for(var i = 0; i<5; i++){
            topicListString += voteList[i].toString();
        }
        this.unityContent.send(
            "MockStats",
            "ReactSetTopicVoteList",
            topicListString
        );
        //console.log("VotedString sent to Unity: " + topicListString);
    }


    async voteForTopic(topic){
            try{
                await api.put('/game/vote?gameToken=' + this.state.gameToken + '&userToken=' + localStorage.getItem('userToken') +'&topic=' + topic);
            } catch (error) {
                alert(`Something fizzled while sending vote to Backend: \n${handleError(error)}`);
            }
    }


     sendRoundsTopic(topic){
           this.unityContent.send(
               "MockStats",
               "ReactSetThisRoundsTopic",
               topic
           )
       //console.log("Topic set sent to Unity:"+ topic);
     }


    async setTopic(topic){
        try{
            this.state.game = await api.put('/game/topic?gameToken=' + this.state.gameToken +'&topic=' + topic);

        } catch (error) {
            alert(`Something fizzled while sending topic to Backend: \n${handleError(error)}`);
        }
        //console.log("Sent topic to backend: " + topic);
    }


    sendRoundNumber(game){
        let round = game.currentRound;
        this.unityContent.send(
            "MockStats",
            "ReactSetRound",
            round
        );
        //console.log("RoundNumber sent to Unity: " + round);
    }


    //Send a string to unity containing info about which player has already chosen his topic
    //1 = has chosen; 0 = has not yet chosen
    //ex. 100101: Player Pos. 1 & 4 & 6 have chosen, Player Pos. 2 & 3 & 5 have not yet chosen
    sendPlayerHasChosenTopicInfo(game){
        var votedString = '';

        for (var i = 0; i<game.playerList.length; i++) {
            if(game.playerList[i].voted == true){
                votedString += '1'
            }else {
                votedString += '0'
            }
        }

        for (var i = 0; i < game.botList.length; i++) {
            if(this.state.game.botsVoted) {
                votedString += '1'
            }else {
                votedString += '0'
            }
        }

        this.unityContent.send(
            "MockStats",
            "ReactSetPlayerHasChosenTopic",
            votedString
        );
        //console.log("String of votes sent to Unity: " + votedString);
    }


    async currentGame() {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await api.get('/game?token=' + localStorage.getItem('gameToken'));

            var game = response.data;

            if(this.state.playerNumber>game.playerList.length){
                this.abortGame();
            }

            this.setState({
                game: game,
                playerNumber: game.playerList.length
            });

            await api.put('/user/updateingametab?userToken=' + localStorage.getItem('userToken'));

            //console.log(this.state.game);

        } catch (error) {
            alert(`Something fizzled while trying to get the game: \n${handleError(error)}`);
        }
    }


    async sendClue(clue){
        try{

            const response = await api.put('/game/clue?gameToken=' + localStorage.getItem('gameToken') +
                '&userToken=' + localStorage.getItem('userToken') + '&clue=' + clue);

        }catch(error){
            alert(`Something fizzled while sending the clue to Backend: \\n${handleError(error)}`);
        }
        //console.log("Sent clue to backend: " + clue);
    }


    sendClueReadyString(game){
        var clueGivenString = '';

        for (var i = 0; i<game.playerList.length; i++) {
            if(game.playerList[i].gaveClue == true){
                clueGivenString += '1'
            }else {
                clueGivenString += '0'
            }
        }
        if(this.state.game.playerList<this.state.playerListLength){
            for (var i = 0; i<(this.state.playerListLength-this.state.game.playerList); i++) {
                clueGivenString += '1'
            }
        }

        for (var i = 0; i < game.botList.length; i++) {
            if(this.state.game.botsClueGiven) {
                clueGivenString += '1'
            }else {
                clueGivenString += '0'
            }
        }

        this.unityContent.send(
            "MockStats",
            "ReactSetPlayerHasSubmittedClue",
            clueGivenString
        );
        //console.log("String of who gave clue sent to Unity: " + clueGivenString);
    }


    sendClueList(){ //Send a string with a ";" delimiter to unity
        let cluesString = this.arrayToString(this.state.game.clueList);
        this.unityContent.send(
            "MockStats",
            "ReactSetClueString",
            cluesString
        );
        //console.log("String of clues sent to Unity: " + cluesString);
    }

    async leaveGame(){
        try {
            clearInterval(this.timerID);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await api.put('/game/leave?gameToken=' + localStorage.getItem('gameToken')+'&userToken='+ localStorage.getItem('userToken'));
            localStorage.removeItem('gameToken');
            this.props.history.push('/dashboard/waitingLobby')
        }catch(error) {
            alert(`Something fizzled while sending leave request to Backend: \\n${handleError(error)}`);
        }
        //console.log("Sent leave request to backend");
    }


    hasGuessed(){
            if(this.state.game.guessGiven){
                this.unityContent.send(
                    "MockStats",
                    "ReactSetActivePlayerMadeGuess",
                    1
                );
                this.unityContent.send(
                    "MockStats",
                    "ReactSendGuessToUnity",
                    this.state.game.guess
                );
                console.log("Sent Unity guess:"+ this.state.game.guess);
                console.log("Sent to Unity that guess was given");
            }else{
                this.unityContent.send(
                    "MockStats",
                    "ReactSetActivePlayerMadeGuess",
                    0
                );
                //console.log("Sent to Unity that guess was not given");
            }


        }

        abortGame(){
            console.log("Sent to Unity that abort was triggered");
            this.unityContent.send(
                "Rounds",
                "ReactAbortGame",

            )
        }

    async getResultOfGuess(){

        if(!this.state.game.guessGiven){
            await this.sendGuess(null);
            //console.log('Told Backend round was skipped');
        }

        if(this.state.game.guessCorrect){
            this.unityContent.send(
                "MockStats",
                "ReactTellRoundWin",
                1
            );

            //console.log("Sent Unity guess:"+ this.state.game.guess);
            //console.log("Sent Unity that round was won");
        }else if((this.state.game.guessCorrect == null)){
            this.unityContent.send(
                "MockStats",
                "ReactTellRoundWin",
                2
            )

        }else{

            this.unityContent.send(
                "MockStats",
                "ReactTellRoundWin",
                0
            );
            //console.log("Sent Unity that round was lost");
        }
    }


    async nextRound(){
        try{
            if(this.state.game.playerList[this.state.game.guesser].token===localStorage.getItem('userToken') && this.state.round === this.state.game.currentRound) {
                const response = await api.put('/game/round?gameToken=' + localStorage.getItem('gameToken'));
                this.state.game = response.data;
                //console.log("Sent to Backend that next round should start");
            }
            while(this.state.round === this.state.game.currentRound){
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            this.sendRoundNumber(this.state.game);

            this.unityContent.send(
                "MockStats",
                "ReactStartNextRound"
            );
            //console.log("Sent to Unity that next round should start");

            if(this.state.game.currentRound>12){return};
            this.setPlayerArray(this.state.game);

        }catch(error){
            alert(`something fizzled while sending next round request to backend: \\n${handleError(error)}`);
        }
    }

    async endGame(score){
    try{
        await new Promise(resolve => setTimeout(resolve, 1000));
        var scoreString = score.toString();
        await api.put('/game/score?userToken='+ localStorage.getItem('userToken')+'&score='+score);
        //console.log("Sent to Backend that game ended, sent score:"+score);

    }catch(error){
        alert(`Something fizzled while sending request to end the game: \\n${handleError(error)}`);
    }

    }


    async sendGuess(guess){
        try{
            await api.put('/game/guess?gameToken=' + localStorage.getItem('gameToken') + '&userToken=' + localStorage.getItem('userToken') +
                '&guess=' + guess);
        }catch(error){
            alert(`Something fizzled while sending the guess to Backend: \\n${handleError(error)}`);
        }
        //console.log("Sent Guess or Skip to Backend");
    }

    async sendScoreStats(game){

        var guessArray = [];
        for(var i = 0; i<this.state.game.playerList.length; i++){
            guessArray.push(this.state.game.playerList[i].guessesCorrect.toString());
        }


        var duplicateArray = [];
        for(var i = 0; i<this.state.game.playerList.length; i++){
            duplicateArray.push(0);
        }


        var validArray = [];
        for(var i = 0; i<this.state.game.playerList.length; i++){
            validArray.push((this.state.game.playerList[i].totalClues-this.state.game.playerList[i].invalidClues).toString());
        }


        if(this.state.game.playerList<this.state.playerListLength){
            for (var i = 0; i<(this.state.playerListLength-this.state.game.playerList); i++) {
                guessArray.push(0);
                duplicateArray.push(0);
                validArray.push(0);
            }
        }

        for(var i = 0; i<this.state.game.botList.length; i++){
            guessArray.push(0);
        }
        for(var i = 0; i<this.state.game.botList.length; i++){
            duplicateArray.push(0);
        }
        for(var i = 0; i<this.state.game.botList.length; i++){
            validArray.push(0);
        }

        var duplicateString = this.arrayToString(duplicateArray);
        var guessString = this.arrayToString(guessArray);
        var validString = this.arrayToString(validArray);


        this.unityContent.send(
            "MockStats",
            "ReactSendCorrectGuessString",
            guessString
        );
        this.unityContent.send(
            "MockStats",
            "ReactSendDuplicateString",
            duplicateString
        );
        this.unityContent.send(
            "MockStats",
            "ReactSendValidCluesSting",
            validString
        );
        //console.log("Sent Stats to Unity:");
        //console.log("String of correct guesses: " + guessString);
        //console.log("String of duplicate clues: " + duplicateString);
        //console.log("String of valid clues: " + validString);

    }


    //MOUNTING AND RENDERING
    componentWillMount() {
        this.setState({
            game: this.currentGame(),
        });
    }

    async handleEvent(event){
        // Cancel the event as stated by the standard.
        event.preventDefault();
        // Chrome requires returnValue to be set.
        event.returnValue = '';

        const key = localStorage.getItem(('userToken'));

        await api.put('/logout?token=' + key);

        localStorage.clear();
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.currentGame(),
            1000
        );
        document.body.style.backgroundColor = '#404040';

        window.addEventListener('beforeunload', this.handleEvent);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        window.removeEventListener('beforeunload', this.handleEvent);
        document.body.style.backgroundColor = '#ffeaaa';
    }

    render() {
        var height = window.innerHeight;
        return (

            <BaseContainer>
                <CentralColumn>
                    <CentralRow>
                <div
                    style={{
                        width: "1080px",
                        height: "600px"
                    }}
                >
                    <Unity unityContent={this.unityContent}
                           className="centralRow centralColumn"
                           style={{background: "rgba(255, 255, 255, 0)"}} />
                </div>
                    </CentralRow>
                </CentralColumn>

                <CentralColumn>
                    <TextContainer>
                <h1>Attention! Unity needs time to load, please wait a moment...</h1>
                    </TextContainer>
                <TextContainer>
                <h1>Important: Do not close or switch the tab!</h1>
                        </TextContainer>
                    </CentralColumn>
            </BaseContainer>
        );
    }
}


export default withRouter(UnityGame);
