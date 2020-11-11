import React from 'react';
import Dropzone from "react-dropzone";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
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
    borderWidth: 3,
    height: 250,
    borderRadius: '0.5em',
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#FDFEFE',
    color: '#0D171f',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};


function ImageDropzone(props) {


    const theme = createMuiTheme({
        typography: {
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
            color: [

            ]
        },
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
                        <ThemeProvider theme={theme}>
                            <Typography variant='h4' style={{paddingTop: '2.5em'}}>Select Images</Typography>
                        </ThemeProvider>
                    </div>
                )}
            </Dropzone>
        </div>
    );
}

export default ImageDropzone