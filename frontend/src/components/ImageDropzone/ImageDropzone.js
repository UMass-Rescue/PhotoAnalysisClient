import React from 'react';
import Dropzone from "react-dropzone";
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import { Typography } from '@material-ui/core';

const dropzoneStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '1em',
    paddingBottom: '1em',
    paddingLeft: '20vw',
    paddingRight: '20vw',
    borderWidth: 2,
    borderRadius: '2em',
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fcfcfc',
    color: '#0D171f',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};


function ImageDropzone(props) {

    function handleFileUpload(fileList) {
        props.filelistfunction(fileList);
    }

    return (
        <div>
            <Dropzone onDrop={handleFileUpload} accept="image/*" >
                {({getRootProps, getInputProps}) => (
                    <div {...getRootProps()} style={dropzoneStyle}>
                        <input {...getInputProps()} />
                        <CloudUploadOutlinedIcon style={{'fontSize': 75}} />
                        <Typography component='h4'>Select Images</Typography>
                    </div>
                )}
            </Dropzone>
        </div>
    );
}

export default ImageDropzone