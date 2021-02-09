class ImageUtilities {
  uriToBlob(uri) {
    console.log("error converting image to blob");
    console.log(uri);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        console.log("success");
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error("uriToBlob failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  }
}

var imageUtil = new ImageUtilities();
export default imageUtil;
