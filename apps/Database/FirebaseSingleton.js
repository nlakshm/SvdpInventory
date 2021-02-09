import Firebase from "firebase";

var Singleton = (function () {
  var instance;
  var databaseInstance;
  var storageInstance;
  /*
  var config = {
    authDomain: "svdp-62877.firebaseapp.com",
    databaseURL: "svdp-62877-default-rtdb.firebaseio.com",
    projectId: "svdp-62877",
  };*/

  var config = {
    apiKey: "AIzaSyBZJZFYlpOmtrlBNhh9Bj9FGWPQptMo9gA",
    authDomain: "sample-234d4.firebaseapp.com",
    databaseURL: "https://sample-234d4.firebaseio.com",
    projectId: "sample-234d4",
    storageBucket: "sample-234d4.appspot.com",
  };

  function createInstance() {
    let object = Firebase.initializeApp(config);
    return object;
  }

  return {
    getDatabaseInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      if (!databaseInstance) {
        databaseInstance = instance.database();
      }
      return databaseInstance;
    },
    getStorageInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      if (!storageInstance) {
        storageInstance = instance.storage();
      }
      return storageInstance;
    },
  };
})();

export default Singleton;
