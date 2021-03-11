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
    apiKey: "AIzaSyBM6C3yGGjZN69WbKMfygPqLO9NY35ocmE",
    authDomain: "testproject-e7290.firebaseapp.com",
    databaseURL: "https://testproject-e7290.firebaseio.com",
    projectId: "testproject-e7290",
    storageBucket: "testproject-e7290.appspot.com",
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
