import Firebase from "firebase";

var Singleton = (function () {
  var instance;
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
    let object = Firebase.initializeApp(config).storage();
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
