import uuid from "node-uuid";
import ImageCompressor from "image-compressor.js";
function upload(files) {
  return new Promise(resolve => {
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var reader = new FileReader();
      var mimeType = file["type"];
      file.returnName = `${uuid.v4()}.${/[^.]+$/.exec(file.name)}`;
      reader.addEventListener("loadend", function(e) {
        return fetch(
          "your-severless-url",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: file.returnName,
              type: file.type
            })
          }
        )
          .then(response => {
            return response.json();
          })
          .then(function(json) {
            var action;

            if (mimeType.split("/")[0] != "image") {
              action = Promise.resolve(
                new Blob([reader.result], { type: file.type })
              );
            } else {
              var compressor = new ImageCompressor();
              action = compressor.compress(
                new Blob([reader.result], { type: file.type }),
                {
                  quality: 0.8,
                  maxWidth: 1240
                }
              );
            }
            return action.then(blob => {
              return putFile(json, blob);
            });
          })
          .then(r => {
            return resolve({
              uploadURL: `https://s3-us-west-2.amazonaws.com/your-bucket-name/${
                file.returnName
              }`
            });
          });
      });
      reader.readAsArrayBuffer(file);
    }
  });
}
function putFile(json, blob) {
  return fetch(json.uploadURL, {
    method: "PUT",
    body: blob
  });
}
export { upload };
