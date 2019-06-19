import * as React from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export class CropImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { crop: null };
  }

  handleSetCrop = crop => {
    this.setState({ crop });
  };

  render() {
    return (
      <ReactCrop
        src={this.props.src}
        crop={this.state.crop}
        onChange={this.handleSetCrop}
        onComplete={this.props.onCropComplete}
        maxWidth={800}
        maxHeight={100}
      />
    );
  }
}
