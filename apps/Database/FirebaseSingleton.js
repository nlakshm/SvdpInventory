import Firebase from "firebase";

var Singleton = (function () {
  var instance;

  var config = {
    authDomain: "svdp-62877.firebaseapp.com",
    databaseURL: "svdp-62877-default-rtdb.firebaseio.com",
    projectId: "svdp-62877",
  };

  function createInstance() {
    let object = Firebase.initializeApp(config).database();
    return object;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

export default Singleton;
