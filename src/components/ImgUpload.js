import React from "react";
import { CropImage } from "./CropImage";

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

  handleCropComplete = crop => {
    this.setState({ crop });
  };

  handleSaveCroppedImage = async () => {
    const { uploadedImageUrl, crop } = this.state;
    if (!uploadedImageUrl || !crop) return;
    const ctx = this.refs.canvas.getContext("2d");
    const image = new Image();
    image.src = uploadedImageUrl;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    ctx.width = crop.width;
    ctx.height = crop.height;

    image.onload = () => {
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
    };

    this.setState({
      croppedImageUrl: await this.saveImage(
        this.refs.canvas.toDataURL("image/jpeg")
      )
    });
  };

  saveImage(imageFile) {
    return Promise.resolve("http://lorempixel.com/800/100/cats/");
  }

  printPreview = () => {
    const printPageSource =
      "<html><head><script>function step1(){\n" +
      "setTimeout('step2()', 10);}\n" +
      "function step2(){window.print();window.close()}\n" +
      "</script></head><body onload='step1()'>\n" +
      "<img src='" +
      this.state.croppedImageUrl +
      "' /></body></html>";
    const pwa = window.open("", "_new");
    pwa.document.open();
    pwa.document.write(printPageSource);
    pwa.document.close();
  };

  render() {
    const { error, uploadedImageUrl, croppedImageUrl } = this.state;

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
            <CropImage
              src={uploadedImageUrl}
              onCropComplete={this.handleCropComplete}
            />
          ) : !!error ? (
            <p className="error" style={{ color: "red" }}>
              {error}
            </p>
          ) : (
            <p>No files currently selected</p>
          )}
        </div>
        <canvas ref="canvas" />
        <div className="preview-save-buttons">
          <button onClick={this.printPreview} disabled={!croppedImageUrl}>
            Print Preview
          </button>
          <button onClick={this.handleSaveCroppedImage}>Save Image</button>
        </div>
      </div>
    );
  }
}
