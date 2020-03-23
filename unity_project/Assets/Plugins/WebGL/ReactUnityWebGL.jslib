mergeInto(LibraryManager.library, {
  ComTest: function(score) {
    ReactUnityWebGL.ComTest(score);
  },
    GameStarted: function() {
      ReactUnityWebGL.GameStarted();
    }
});