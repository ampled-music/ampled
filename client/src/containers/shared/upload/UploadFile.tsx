import * as React from 'react';

interface UploadFileProps {
  uploadFile: any;
  inputRefId?: string;
  acceptedFileTypes?: string;
}

export class UploadFile extends React.Component<UploadFileProps, any> {
  fileInput = { value: '' };

  uploadFile = (event) => {
    event.preventDefault();
    const selectedFile = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.props.uploadFile({
        body: reader.result,
        fileName: selectedFile.name,
        size: selectedFile.size,
        mimeType: selectedFile.type,
        file: selectedFile,
      });
    };

    reader.readAsDataURL(selectedFile);
    this.resetFileInputValue();
  };

  resetFileInputValue = () => {
    this.fileInput.value = '';
  };

  render() {
    return (
      <div>
        <input
          style={{ display: 'none' }}
          type="file"
          accept={this.props.acceptedFileTypes || 'image/*'}
          id={this.props.inputRefId || 'input-upload-file'}
          onChange={this.uploadFile}
          ref={(ref) => (this.fileInput = ref)}
        />
      </div>
    );
  }
}
