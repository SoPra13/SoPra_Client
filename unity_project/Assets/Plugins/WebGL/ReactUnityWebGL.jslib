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
    AskForTopicsList: function() {
      ReactUnityWebGL.AskForTopicsList();
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
        }
});