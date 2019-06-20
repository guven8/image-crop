import React from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const maxImageSize = 1000000; // 1MB

export class ImgUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedImageUrl: null,
      croppedImageUrl: null,
      crop: null,
      error: null
    };
  }

  handleUploadImage = e => {
    const image = e.target.files[0];
    if (!image) return;
    if (image.size > maxImageSize) {
      this.setState({ error: "Max image size is 1MB" });
    } else {
      this.setState({
        uploadedImageUrl: URL.createObjectURL(image),
        error: null
      });
    }
  };

  handleClearUploadedImageUrl = () => {
    this.setState({ uploadedImageUrl: null });
  };

  handleSetCrop = crop => {
    this.setState({ crop });
  };

  handleSaveImage = async () => {
    const { crop, uploadedImageUrl } = this.state;
    const image = new Image();
    image.src = uploadedImageUrl;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // As a blob
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        blob.name = "cropped_image";
        resolve(blob);
      }, "image/jpeg");
    });

    // As Base64 string
    this.setState({ croppedImageUrl: URL.createObjectURL(blob) }); // my image preview
    // this.setState({ croppedImageUrl: await this.saveImage(canvas.toDataURL("image/jpeg")) });
  };

  saveImage(imageFile) {
    return Promise.resolve("http://lorempixel.com/800/100/cats/");
  }

  printPreview = async () => {
    const { croppedImageUrl } = this.state;
    const printPageSource =
      "<html><head><script>function step1(){\n" +
      "setTimeout('step2()', 10);}\n" +
      "function step2(){window.print();window.close()}\n" +
      "</script></head><body onload='step1()'>\n" +
      "<img src='" +
      croppedImageUrl +
      "' /></body></html>";
    const pwa = window.open("", "_new");
    pwa.document.open();
    pwa.document.write(printPageSource);
    pwa.document.close();
  };

  render() {
    const { error, uploadedImageUrl, crop, croppedImageUrl } = this.state;

    return (
      <div>
        <div>
          <label htmlFor="image-upload">
            Choose images to upload (PNG, JPG){" "}
          </label>
          <input
            type="file"
            id="image-upload"
            name="image-upload"
            accept=".jpg, .jpeg, .png"
            onChange={this.handleUploadImage}
          />
          {!!uploadedImageUrl && (
            <button onClick={this.handleClearUploadedImageUrl}>Clear</button>
          )}
        </div>
        <div className="preview">
          {!!uploadedImageUrl ? (
            <ReactCrop
              src={uploadedImageUrl}
              crop={crop}
              onChange={this.handleSetCrop}
              maxWidth={800}
              maxHeight={100}
            />
          ) : !!error ? (
            <p className="error" style={{ color: "red" }}>
              {error}
            </p>
          ) : (
            <p>No files currently selected</p>
          )}
        </div>
        {!!croppedImageUrl && <img src={croppedImageUrl} />}
        <div className="preview-save-buttons">
          <button onClick={this.printPreview} disabled={!croppedImageUrl}>
            Print Preview
          </button>
          <button onClick={this.handleSaveImage}>Save Image</button>
        </div>
      </div>
    );
  }
}
