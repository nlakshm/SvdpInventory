import dateUtil from "../Utilities/dateUtil";
import imageUtil from "../Utilities/ImageUtil";
import Singleton from "../Database/FirebaseSingleton";
import Firebase from "firebase";
class CategoryComponent {
  constructor() {}

  getPrimaryKey(category, stateRef) {
    if (category.id != -1) {
      this.addCategoryMetaDataToFirebase(category.id, category, stateRef);
    } else {
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
  }

  updateCategory(category, subCategory, stateRef) {
    try {
      let dateNow = new Date().toLocaleString();
      dateNow = dateUtil.formatLocaleDateString(dateNow);
      Singleton.getDatabaseInstance()
        .ref("/categories/" + category.id)
        .once("value")
        .then((snapshot) => {
          let data = snapshot.val();
          console.log(data);
          if (subCategory["operation"] != undefined) {
            if (subCategory.operation == "add") {
              data["totalItems"] += 1;
            }
            data["lastUpdatedTime"] = dateNow;
            data["totalQuantity"] =
              data["totalQuantity"] + parseInt(subCategory.totalQuantity);
            data["totalQuantity"] =
              data["totalQuantity"] - subCategory.initialQuantity;
          } else {
            data["totalItems"] -= 1;
            data["totalQuantity"] =
              data["totalQuantity"] - subCategory.totalQuantity;
          }
          Singleton.getDatabaseInstance()
            .ref("/categories/" + category.id)
            .update(data)
            .then(() => {
              stateRef.setState({
                message: "successfully updated cat data",
                isError: false,
                isSubmitButtonEnabled: true,
              });
            });
        });
    } catch (error) {
      stateRef.setState({
        message: "error updating category data",
        isError: true,
        isSubmitButtonEnabled: true,
      });
    }
  }

  getMetaData(primary_key, category) {
    let data = {};
    data["totalQuantity"] = 0;
    data["lastUpdatedTime"] = "";
    data["id"] = primary_key;
    data["totalItems"] = 0;
    data["downloadURL"] = category.downloadURL;
    data["isPreloadedItem"] = category.isPreloadedItem;
    data["imageID"] = category.imageID;
    data["dropdown"] = category.dropdownSelectedItem;
    data["name"] = category.categoryName;

    return data;
  }

  edit(category, stateRef) {
    this.add(category, stateRef);
  }

  addCategoryMetaDataToFirebase(primary_key, category, stateRef) {
    console.log("adding new category meta data to firebase");
    let data = this.getMetaData(primary_key, category);

    Singleton.getDatabaseInstance()
      .ref("/categories/" + primary_key)
      .set(data)
      .then(function () {
        stateRef.setState({
          message: "successfully uploaded data to database",
          isError: false,
          isSubmitButtonEnabled: true,
          categoryName: "",
          imageURI: "",
        });
      })
      .catch(function () {
        stateRef.setState({
          message: "error uploading metadata to firebase",
          isError: false,
          isSubmitButtonEnabled: true,
        });
      });
  }
  checkAddConstraints(category, stateRef) {
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

  getImageId(category, stateRef) {
    try {
      Singleton.getDatabaseInstance()
        .ref("/image-primary-key")
        .once("value")
        .then((snapshot) => {
          let primary_key = snapshot.val() + 1;
          Singleton.getDatabaseInstance()
            .ref("/image-primary-key")
            .set(primary_key)
            .then(() => {
              this.uploadImage(primary_key, category, stateRef);
            });
        });
    } catch (error) {
      stateRef.setState({
        message: "error getting primary key for image",
        isError: false,
        isSubmitButtonEnabled: true,
      });
    }
  }

  uploadImage(imageID, category, stateRef) {
    imageUtil.uriToBlob(category.imageURI).then((file) => {
      var uploadTask = Singleton.getStorageInstance()
        .ref(imageID.toString())
        .put(file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
            category["isPreloadedItem"] = false;
            category["imageID"] = imageID;
            this.getPrimaryKey(category, stateRef);
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
          category["isPreloadedItem"] = true;
          this.getPrimaryKey(category, stateRef);
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
    console.log(category);
    if (this.checkAddConstraints(category, stateRef)) {
      if (category.operation == "add") {
        if (category.imageURI.length > 0) {
          this.getImageId(category, stateRef);
        } else {
          this.getPreLoadedImageURI(category, stateRef);
        }
      } else if (category.operation == "edit") {
        if (category.isCategoryImageURIChanged) {
          this.deleteImage(category, stateRef, "update");
        } else {
          this.update(category, stateRef);
        }
      }
    }
  }

  update(category, stateRef) {
    if (category.imageURI.length == 0) {
      if (category.isCategoryChanged) {
        this.getPreLoadedImageURI(category, stateRef);
      } else {
        this.getPrimaryKey(category, stateRef);
      }
    } else {
      if (category.isCategoryImageURIChanged) {
        this.getImageId(category, stateRef);
      } else {
        this.getPrimaryKey(category, stateRef);
      }
    }
  }

  deleteImage(category, stateRef, forwardTo) {
    console.log("inside image delete");
    console.log(category);
    if (category.imageID == -1) {
      if (forwardTo == "update") {
        this.update(category, stateRef);
      }
    } else {
      try {
        Singleton.getStorageInstance()
          .ref(category.imageID.toString())
          .delete()
          .then(() => {
            if (forwardTo == "update") {
              this.update(category, stateRef);
            } else {
              stateRef.setState({
                message: "successfully deleted",
                isError: false,
              });
            }
          });
      } catch (error) {
        stateRef.setState({
          message: "unsuccessfull delete",
          isError: true,
        });
      }
    }
  }

  delete(category, stateRef) {
    if (category.totalItems == 0) {
      var ref = Singleton.getDatabaseInstance().ref("categories");
      ref.once("value").then((snapshot) => {
        if (snapshot.exists() && snapshot.child(String(category.id)).exists()) {
          Singleton.getDatabaseInstance()
            .ref("categories/" + String(category.id))
            .remove()
            .then(() => {
              if (!category.isPreloadedItem) {
                console.log("after successful delete of the cat component");
                this.deleteImage(category, stateRef, "print-result");
              } else {
                stateRef.setState({
                  message: "successfully deleted ",
                  isError: false,
                });
              }
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
    if (datePrev.length == 0) {
      return "NA";
    }

    rs = dateUtil.timeDiffCalc(dateNow, datePrev);

    return rs["days"] != 0
      ? String(rs["days"]) + "d ago"
      : rs["hours"] != 0
      ? String(rs["hours"]) + "h ago"
      : rs["minutes"] != 0
      ? String(rs["minutes"]) + "m ago"
      : "1m ago";
  }
}

var categoryComponent = new CategoryComponent();
export default categoryComponent;
