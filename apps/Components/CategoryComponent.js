import dateUtil from "../Utilities/dateUtil";
import imageUtil from "../Utilities/ImageUtil";
import Singleton from "../Database/FirebaseSingleton";
import Firebase from "firebase";
class CategoryComponent {
  constructor() {}

  getPrimaryKey(category, stateRef) {
    try {
      Singleton.getDatabaseInstance()
        .ref("/categories-primary-key")
        .once("value")
        .then((snapshot) => {
          let primary_key = snapshot.val() + 1;
          Singleton.getDatabaseInstance()
            .ref("/categories-primary-key")
            .set(primary_key)
            .then(() => {
              this.addCategoryMetaDataToFirebase(
                primary_key,
                category,
                stateRef
              );
            });
        });
    } catch (error) {
      stateRef.setState({
        message: "error getting primary key",
        isError: false,
        isSubmitButtonEnabled: true,
      });
    }
  }

  addCategoryMetaDataToFirebase(primary_key, category, stateRef) {
    console.log("adding new category meta data to firebase");
    category["totalQuantity"] = 0;
    category["lastUpdatedTime"] = "";
    category["id"] = primary_key;
    category["totalItems"] = 0;

    Singleton.getDatabaseInstance()
      .ref("/categories/" + primary_key)
      .set(category)
      .then(function () {
        console.log("successfully uploaded");
        stateRef.setState({
          message: "successfully uploaded data to database",
          isError: false,
          isSubmitButtonEnabled: true,
          categoryName: "",
          imageURI: "",
        });
      })
      .catch(function () {
        console.log("error uploading metadata to firebase");
        stateRef.setState({
          message: "error uploading metadata to firebase",
          isError: false,
          isSubmitButtonEnabled: true,
        });
      });
  }
  checkAddConstraints(category, stateRef) {
    console.log(category);
    let imageURILength = category.imageURI.length;
    let dropdownSelectedItemLength = category.dropdownSelectedItem.length;
    let trimmedName = category.categoryName.trim();
    if (trimmedName.length == 0) {
      stateRef.setState({
        message: "please enter a name",
        isError: true,
        isSubmitButtonEnabled: true,
      });
      return false;
    }
    if (imageURILength == 0 && dropdownSelectedItemLength == 0) {
      stateRef.setState({
        message: "pick an image or select from drop down",
        isError: true,
        isSubmitButtonEnabled: true,
      });
      return false;
    } else if (imageURILength > 0 && dropdownSelectedItemLength > 0) {
      stateRef.setState({
        message: "do not select both options",
        isError: true,
        isSubmitButtonEnabled: true,
      });
      return false;
    }
    return true;
  }

  uploadImage(category, stateRef) {
    imageUtil.uriToBlob(category.imageURI).then((file) => {
      var uploadTask = Singleton.getStorageInstance()
        .ref(category.categoryName)
        .put(file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case Firebase.storage.TaskState.RUNNING:
              stateRef.setState({
                message: "uploading image " + progress,
                isError: false,
              });
              break;
          }
        },
        (error) => {
          stateRef.setState({
            message: "error uploading image ",
            isError: false,
            isSubmitButtonEnabled: true,
          });
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            category["downloadURL"] = downloadURL;
            this.getPrimaryKey(
              {
                name: category.categoryName,
                downloadURL: category.downloadURL,
                dropdown: "",
              },
              stateRef
            );
          });
        }
      );
    });
  }

  getPreLoadedImageURI(category, stateRef) {
    try {
      Singleton.getDatabaseInstance()
        .ref("/preloaded-images/" + category.dropdownSelectedItem)
        .once("value")
        .then((snapshot) => {
          category["downloadURL"] = snapshot.val();

          this.getPrimaryKey(
            {
              name: category.categoryName,
              downloadURL: category.downloadURL,
              dropdown: category.dropdownSelectedItem,
            },
            stateRef
          );
          console.log(category);
        });
    } catch (error) {
      stateRef.setState({
        message: "error getting preloaded image URI",
        isError: true,
        isSubmitButtonEnabled: true,
      });
    }
  }

  add(category, stateRef) {
    if (this.checkAddConstraints(category, stateRef)) {
      if (category.imageURI.length > 0) {
        this.uploadImage(category, stateRef);
      } else {
        this.getPreLoadedImageURI(category, stateRef);
      }
    }
  }

  async edit(category, stateRef) {
    await this.delete(category, stateRef);
    this.add(category, stateRef);
  }

  deleteImage(category, stateRef) {
    console.log("inside image delete");
    console.log(category);
    try {
      Singleton.getStorageInstance()
        .ref(category.name)
        .delete()
        .then(function () {
          stateRef.setState({
            message: "successfully deleted image file",
            isError: false,
          });
        });
    } catch (error) {
      console.log(error);
      stateRef.setState({
        message: "unsuccessfull delete",
        isError: true,
      });
    }
  }

  async delete(category, stateRef) {
    console.log("inside delete");
    console.log(category);
    this.deleteImage(category, stateRef);
    if (category.totalItems == 0) {
      var ref = Singleton.getDatabaseInstance().ref("categories");
      ref.once("value").then(function (snapshot) {
        if (snapshot.exists() && snapshot.child(String(category.id)).exists()) {
          Singleton.getDatabaseInstance()
            .ref("categories/" + String(category.id))
            .remove()
            .then(() => {
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
      Singleton.getDatabaseInstance()
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
              message: "component ! available/ empty category list",
              isError: true,
              categories: {},
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

  fetchPreLoadedImageItems(stateRef) {
    console.log("inside fetch preloaded images");
    try {
      Singleton.getDatabaseInstance()
        .ref("/preloaded-images")
        .once("value")
        .then(function (snapshot) {
          if (stateRef.mounted && snapshot.exists()) {
            console.log("inside success fetch pre loaded images");

            let resultSet = Object.keys(snapshot.val()).map((key) => {
              return { label: key, value: key };
            });
            console.log(stateRef.state.dropdownItems);
            stateRef.setState({
              dropdownItems: stateRef.state.dropdownItems.concat(resultSet),
              message: "drop down data retrieved successfully",
              isError: false,
            });
          } else {
            console.log("inside else fetch pre loaded images");
            stateRef.setState({
              message: "component not available/ reference error",
              isError: true,
            });
          }
        });
    } catch (error) {
      console.log("inside erro fetch pre loaded images");
      stateRef.setState({
        message: "error fetching drop down data " + error,
        isError: false,
      });
    }
  }

  getLastUpdatedTime(datePrev) {
    let dateNow = new Date().toLocaleString();
    dateNow = dateUtil.formatLocaleDateString(dateNow);
    rs = dateUtil.timeDiffCalc(dateNow, datePrev);
    if (isNaN(rs)) {
      return "NA";
    }
    return rs["days"] != 0
      ? String(rs["days"]) + "d ago"
      : rs["hours"] != 0
      ? String(rs["hours"]) + "h ago"
      : rs["minutes"] != 0
      ? String(rs["minutes"]) + "m ago"
      : "";
  }
}

var categoryComponent = new CategoryComponent();
export default categoryComponent;
