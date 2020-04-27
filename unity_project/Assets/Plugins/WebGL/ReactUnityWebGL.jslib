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
    PlayerVoted: function(topic) {
      ReactUnityWebGL.PlayerVoted(topic);
    },
    FetchVotedString: function() {
          ReactUnityWebGL.FetchVotedString();
        },
    FetchRound: function() {
          ReactUnityWebGL.FetchRound();
        },
    FetchTopicList: function() {
          ReactUnityWebGL.FetchTopicList();
        },
    LeaveGame: function() {
          ReactUnityWebGL.LeaveGame();
        },
    SendClueToReact: function(message) {
          ReactUnityWebGL.SendClueToReact(Pointer_stringify(message));
        },
    SendTopicToReact: function(message) {
          ReactUnityWebGL.SendTopicToReact(Pointer_stringify(message));
        },
    FetchSubmittedClues: function() {
          ReactUnityWebGL.FetchSubmittedClues();
        },
    FetchCluesString: function() {
          ReactUnityWebGL.FetchCluesString();
        },
    UpdateScore: function(score) {
          ReactUnityWebGL.UpdateScore(score);
        }
});