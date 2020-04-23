mergeInto(LibraryManager.library, {
  ComTest: function(score) {
    ReactUnityWebGL.ComTest(score);
  },
    PlayerHasConnected: function() {
      ReactUnityWebGL.PlayerHasConnected();
    },
    FetchPlayerInfo: function() {
      ReactUnityWebGL.FetchPlayerInfo();
    },
    SendTopicInput: function(topic) {
      ReactUnityWebGL.SendTopicInput(topic);
    },
    TopicsHaveBeenChosen: function() {
          ReactUnityWebGL.TopicsHaveBeenChosen();
        },
    FetchPlayerMadeTopicChoice: function() {
          ReactUnityWebGL.FetchPlayerMadeTopicChoice();
        },
    AskForRound: function() {
          ReactUnityWebGL.AskForRound();
        },
    CallsForTopicList: function() {
          ReactUnityWebGL.CallsForTopicList();
        },
    CallsForLeaveGame: function() {
          ReactUnityWebGL.CallsForLeaveGame();
        },
    SendGuessToReact: function(message) {
          ReactUnityWebGL.SendGuessToReact(Pointer_stringify(message));
        },
    SendTopicStringToReact: function(message) {
          ReactUnityWebGL.SendTopicStringToReact(Pointer_stringify(message));
        }
});