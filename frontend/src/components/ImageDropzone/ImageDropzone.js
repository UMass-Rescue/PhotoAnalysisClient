import React from 'react';
import Dropzone from "react-dropzone";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const dropzoneStyle = {

    // flex: 1,
    // display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center',
    // paddingTop: '1em',
    // paddingBottom: '1em',
    // paddingLeft: '20vw',
    // paddingRight: '20vw',
    // borderWidth: 3,
    // height: 250,
    // borderRadius: '0.5em',
    // borderColor: '#eeeeee',
    // borderStyle: 'dashed',
    // backgroundColor: '#FDFEFE',
    // color: '#0D171f',
    // outline: 'none',
    // transition: 'border .24s ease-in-out'


    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 3,
    borderStyle: 'dashed',
    borderRadius: '0.5em',
    paddingTop: '3vh',
    paddingBottom: '3vh',
    paddingLeft: '15vw',
    paddingRight: '15vw',
    borderColor: '#2688DD'

};


function ImageDropzone(props) {


    const uploadFontTheme = createMuiTheme({
        typography: {
            "fontFamily": 'Recursive, sans-serif',
            "fontSize": 12,
            "color": '#2688DD',
            "fontWeightLight": 300,
            "fontWeightRegular": 400,
            "fontWeightMedium": 500
        }
    });


    function handleFileUpload(fileList) {
        props.filelistfunction(fileList);
    }

    return (
        <div>
            <Dropzone onDrop={handleFileUpload} accept="image/*" >
                {({getRootProps, getInputProps}) => (
                    <div {...getRootProps()} style={dropzoneStyle}>
                        <input {...getInputProps()} />
                        <ThemeProvider theme={uploadFontTheme}>
                            <Typography variant='h4'>Drop Images Here</Typography>
                            <Typography variant='h6'>or</Typography>
                            <Typography variant='h4'>Click to Upload</Typography>
                        </ThemeProvider>
                    </div>
                )}
            </Dropzone>
        </div>
    );
}

export default ImageDropzone