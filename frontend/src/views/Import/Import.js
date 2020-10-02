import React, {useState} from 'react';
import {makeStyles} from '@material-ui/styles';
import axios from 'axios';
import {Grid, Typography, Button, TextField} from '@material-ui/core';
import ImageDropzone from "../../components/ImageDropzone/ImageDropzone";
import ImageDisplayCard from "../../components/ImageDisplayCard/ImageDisplayCard";



const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const Import = () => {
    const classes = useStyles();

    const [filesUploaded, setFilesUploaded] = useState([]);
    const [keyToCheck, setKeyToCheck] = useState("");


    function checkStatus() {
        let config = {
            method: 'get',
            url: (keyToCheck.length === 0) ? 'http://localhost:5000/predict' : 'http://localhost:5000/predict/'+keyToCheck,
            headers: { }
        };
        axios(config).then((response) => console.log(response.data.results));
    }

    function uploadImages() {

            const url = 'http://localhost:5000/predict';
            const formData = new FormData();
            for (let i = 0; i < filesUploaded.length; i++) {
                formData.append('images', filesUploaded[i]);
            }
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            axios.post(url, formData, config).then((response) => console.log(response.data.images));

        // function uploadSingleImage(imageFile) {
        //     const url = 'http://localhost:5057/images';
        //     const formData = new FormData();
        //     formData.append('file', imageFile);
        //     const config = {
        //         headers: {
        //             'content-type': 'multipart/form-data'
        //         }
        //     }
        //     axios.post(url, formData, config).then((response) => console.log(response.data));
        // }
        //
        //
        // if (filesUploaded.length === 0) {
        //     alert('You must add files to upload!');
        //     return;
        // }
        //
        // filesUploaded.map((file) => uploadSingleImage(file));
    }

    function updateKey(e) {
        setKeyToCheck(e.target.value);
    }


    return (
        <div className={classes.root}>
            <Grid
                container
                spacing={4}
                direction="column"
                alignItems="center"
                justify="center"
            >

                {/* Page Title  */}
                <Grid item xs={12}>
                    <Typography variant="h2" mt={5}>
                        Import Images for Processing
                    </Typography>
                </Grid>

                {/* Display Image Drag-And-Drop Area For Upload  */}
                <Grid item xs={12}>
                    <ImageDropzone filelistfunction={setFilesUploaded}/>
                    {/*<form encType="multipart/form-data" method="post" onSubmit={uploadImages} >*/}
                    {/*    <input id="FormInput" name="files" type="file" multiple style={dropzoneStyle} />*/}
                    {/*    <Button variant="contained" color="primary" type="submit">*/}
                    {/*        Upload*/}
                    {/*    </Button>*/}
                    {/*</form>*/}
                </Grid>

                <Grid>
                    <Button variant="contained" color="primary" type="submit" onClick={uploadImages}>Upload Images</Button>
                </Grid>


                {/* Display List of All File Names */}
                {filesUploaded.length > 0 &&
                <Grid
                    container
                    justify="space-evenly"
                    direction="row"
                    spacing={3}
                >
                    <Grid
                        container
                        spacing={4}
                        direction="column"
                        alignItems="center"
                        justify="center"
                    >
                        <br />
                        <hr />
                        <br />
                        <Typography variant="h4">
                            Image Upload Results
                        </Typography>
                        <br />
                        <br />
                    </Grid>

                    {
                        filesUploaded.map((fileName) => (
                            <Grid
                                item
                                xs={4}
                                key={fileName.name}
                            >
                                <ImageDisplayCard  title={fileName.name}/>
                            </Grid>
                        ))
                    }
                </Grid>
                }


                <br />

                <TextField id="standard-basic" label="Job ID" onChange={updateKey} />
                <br />
                <Button variant="contained" color="primary" type="submit" onClick={checkStatus}>Check Result</Button>

            </Grid>
        </div>
    );
};

export default Import;
