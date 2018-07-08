class File {
  constructor() {}
  // dataURL to blob
  dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  }

  // blob to dataURL
  blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = function(e) {
        resolve(e.target.result)
      }
      fileReader.onerror = function(e) {
        reject(e);
      }
      fileReader.readAsDataURL(blob);
    });
  }
}
const file = new File;
export {
  file
}
