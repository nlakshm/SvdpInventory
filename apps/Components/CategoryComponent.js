import dateUtil from "../Utilities/dateUtil";
import imageUtil from "../Utilities/ImageUtil";
import Singleton from "../Database/FirebaseSingleton";
class CategoryComponent {
  constructor() {}

  add(category) {
    imageUtil.uriToBlob(category.imageURI).then((file) => {
      Singleton.getInstance().ref("sampletest").put(file);
    });
  }

  delete(category, stateRef) {
    if (category.totalItems == 0) {
      var ref = Singleton.getInstance().ref("categories");
      ref.once("value").then(function (snapshot) {
        if (
          snapshot.exists() &&
          snapshot.child("cat-" + String(category.id)).exists()
        ) {
          Singleton.getInstance()
            .ref("categories/cat-" + String(category.id))
            .remove()
            .then(function () {
              stateRef.setState({
                message: "successfully deleted",
                isError: false,
              });
            })
            .catch(function (error) {
              stateRef.setState({
                message: "cannot perform delete " + error,
                isError: true,
              });
            });
        } else {
          stateRef.setState({
            message: "item does not exists",
            isError: true,
          });
        }
      });
    } else {
      stateRef.setState({
        message: "sub - category item exists",
        isError: true,
      });
    }
  }

  fetchData(stateRef) {
    try {
      Singleton.getInstance()
        .ref("/categories/")
        .on("value", function (snapshot) {
          if (stateRef.mounted && snapshot.exists()) {
            stateRef.setState({
              categories: snapshot.val(),
              message: "data retrieved successfully",
              isError: false,
            });
          } else {
            stateRef.setState({
              message: "component not available/ reference error",
              isError: true,
            });
          }
        });
    } catch (error) {
      stateRef.setState({
        message: "error fetching category data " + error,
        isError: false,
      });
    }
  }

  getLastUpdatedTime(datePrev) {
    let dateNow = new Date().toLocaleString();
    dateNow = dateUtil.formatLocaleDateString(dateNow);
    rs = util.timeDiffCalc(dateNow, datePrev);
    return rs["days"] != 0
      ? String(rs["days"]) + "d"
      : rs["hours"] != 0
      ? String(rs["hours"]) + "h"
      : rs["minutes"] != 0
      ? String(rs["minutes"]) + "m"
      : "";
  }
}

var categoryComponent = new CategoryComponent();
export default categoryComponent;
