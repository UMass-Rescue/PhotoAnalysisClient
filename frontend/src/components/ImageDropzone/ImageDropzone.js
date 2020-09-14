import React from 'react';
import Dropzone from "react-dropzone";
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';

const dropzoneStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '2em',
    paddingBottom: '2em',
    paddingLeft: '8em',
    paddingRight: '8em',
    borderWidth: 2,
    borderRadius: '2em',
    borderColor: '#eeeeee',
    borderStyle: 'solid',
    backgroundColor: 'rgba(162, 166, 171, 0.3)',
    color: '#0D171f',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};


function ImageDropzone(props) {

    function handleFileUpload(fileList) {
        props.filelistfunction(fileList.map((fileObject) => fileObject.name));
    }

    return (
        <div>
            <Dropzone onDrop={handleFileUpload}>
                {({getRootProps, getInputProps}) => (
                    <div {...getRootProps()} style={dropzoneStyle}>
                        <input {...getInputProps()} />
                        <CloudUploadOutlinedIcon style={{'fontSize': 75}} />
                        <p>Upload Images</p>
                    </div>
                )}
            </Dropzone>
        </div>
    );
}

export default ImageDropzone