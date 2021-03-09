import dateUtil from "../Utilities/dateUtil";
import imageUtil from "../Utilities/ImageUtil";
import Singleton from "../Database/FirebaseSingleton";
import Firebase from "firebase";

import categoryComponent from "../Components/CategoryComponent";
class SubCategoryComponent {
  constructor() {}

  getPrimaryKey(subCategory, stateRef) {
    try {
      Singleton.getDatabaseInstance()
        .ref("/sub-categories-primary-key")
        .once("value")
        .then((snapshot) => {
          let primary_key = snapshot.val() + 1;
          Singleton.getDatabaseInstance()
            .ref("/sub-categories-primary-key")
            .set(primary_key)
            .then(() => {
              this.addSubCategoryMetaDataToFirebase(
                primary_key,
                subCategory,
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

  addSubCategoryMetaDataToFirebase(primary_key, subCategory, stateRef) {
    console.log("adding new sub category  meta data to firebase");
    let data = {};
    let category = subCategory["category"];
    data["name"] = subCategory["name"];
    data["category"] = subCategory["category"]["name"];
    data["categoryId"] = subCategory["category"]["id"];
    data["downloadURL"] = subCategory["downloadURL"];
    data["totalQuantity"] = parseInt(subCategory["totalQuantity"]);
    data["location"] = subCategory["dropdownSelectedLocationItem"];
    data["lastUpdatedTime"] = subCategory["currentDate"];

    console.log(subCategory);
    let dateNow = new Date().toLocaleString();
    dateNow = dateUtil.formatLocaleDateString(dateNow);

    Singleton.getDatabaseInstance()
      .ref("/sub-categories/" + subCategory.category.id + "/" + primary_key)
      .set(data)
      .then(function () {
        category["totalQuantity"] =
          category["totalQuantity"] + data["totalQuantity"];
        category["lastUpdatedTime"] = dateNow;
        category["totalItems"] += 1;
        categoryComponent.updateCategory(category, stateRef);
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
  checkAddConstraints(subCategory, stateRef) {
    let imageURILength = subCategory.imageURI.length;
    let ddSubCatLength = subCategory.dropdownSelectedSubCategoryItem.length;

    let name = subCategory.name.trim();
    console.log(subCategory.totalQuantity);
    if (imageURILength == 0 && ddSubCatLength == 0) {
      stateRef.setState({
        message: "pick an image or select from drop down",
        isError: true,
        isSubmitButtonEnabled: true,
      });
      return false;
    } else if (imageURILength > 0 && ddSubCatLength > 0) {
      stateRef.setState({
        message: "do not select both options",
        isError: true,
        isSubmitButtonEnabled: true,
      });
      return false;
    } else if (imageURILength > 0 && name.length == 0) {
      stateRef.setState({
        message: "please fill the sub category name",
        isError: true,
        isSubmitButtonEnabled: true,
      });
      return false;
    } else if (subCategory.totalQuantity == 0) {
      stateRef.setState({
        message: "please enter the total quantity",
        isError: true,
        isSubmitButtonEnabled: true,
      });
      return false;
    } else if (subCategory.dropdownSelectedLocationItem.length == 0) {
      stateRef.setState({
        message: "please select the location of the item",
        isError: true,
        isSubmitButtonEnabled: true,
      });
      return false;
    } else if (
      subCategory.currentDate.length == 0 ||
      subCategory.date < new Date()
    ) {
      stateRef.setState({
        message: "please pick a doe / pick a date greater",
        isError: true,
        isSubmitButtonEnabled: true,
      });
      return false;
    }
    return true;
  }

  add(subCategory, stateRef) {
    if (this.checkAddConstraints(subCategory, stateRef)) {
      if (subCategory.imageURI.length > 0) {
        this.uploadImage(subCategory, stateRef);
      } else {
        this.getPreLoadedImageURI(subCategory, stateRef);
      }
    }
  }

  uploadImage(subCategory, stateRef) {
    imageUtil.uriToBlob(subCategory["imageURI"]).then((file) => {
      var uploadTask = Singleton.getStorageInstance()
        .ref(subCategory["name"])
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
            subCategory["downloadURL"] = downloadURL;
            this.getPrimaryKey(subCategory, stateRef);
          });
        }
      );
    });
  }

  getPreLoadedImageURI(subCategory, stateRef) {
    try {
      let reference = Singleton.getDatabaseInstance().ref(
        "/preloaded-images/" + subCategory["dropdownSelectedSubCategoryItem"]
      );

      reference.once("value").then((snapshot) => {
        subCategory["downloadURL"] = snapshot.val();
        subCategory["name"] = subCategory["dropdownSelectedSubCategoryItem"];
        this.getPrimaryKey(subCategory, stateRef);
      });
    } catch (error) {
      stateRef.setState({
        message: "error getting preloaded image URI",
        isError: true,
        isSubmitButtonEnabled: true,
      });
    }
  }

  async edit(category, stateRef) {
    await this.delete(category, stateRef);
    this.add(category, stateRef);
  }

  deleteImage(category, stateRef) {
    console.log("inside image delete");

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
      stateRef.setState({
        message: "unsuccessfull delete",
        isError: true,
      });
    }
  }

  async delete(category, stateRef) {
    console.log("inside delete");

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

  fetchData(categoryData, stateRef) {
    try {
      Singleton.getDatabaseInstance()
        .ref("/sub-categories/" + categoryData.id)
        .on("value", function (snapshot) {
          if (stateRef.mounted && snapshot.exists()) {
            stateRef.setState({
              subCategories: snapshot.val(),
              message: "data retrieved successfully",
              isError: false,
              category: categoryData,
            });
          } else {
            stateRef.setState({
              message: "component ! available/ empty category list",
              isError: true,
              subCategories: {},
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

  fetchLocations(stateRef) {
    console.log("inside fetch locations");
    try {
      Singleton.getDatabaseInstance()
        .ref("/location")
        .once("value")
        .then(function (snapshot) {
          if (stateRef.mounted && snapshot.exists()) {
            console.log("inside success fetch locations");
            let data = snapshot.val();
            let resultSet = Object.keys(data).map((key) => {
              return { label: data[key], value: data[key] };
            });

            stateRef.setState({
              dropdownLocationItems: resultSet,
              message: "drop down data retrieved successfully",
              isError: false,
            });
          } else {
            console.log("inside else fetch location");
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
    if (new Date() > new Date(datePrev)) {
      return "expired";
    }
    dateNow = dateUtil.formatLocaleDateString(dateNow);
    if (datePrev.length == 0) {
      return "NA";
    }

    rs = dateUtil.timeDiffCalc(datePrev, dateNow);

    return rs["days"] != 0
      ? String(rs["days"]) + "d to go"
      : rs["hours"] != 0
      ? String(rs["hours"]) + "h to go"
      : rs["minutes"] != 0
      ? String(rs["minutes"]) + "m to go"
      : "1m to go";
  }
}

var subCategoryComponent = new SubCategoryComponent();
export default subCategoryComponent;
