import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { Grid, Typography, Button, Checkbox, FormGroup, FormControlLabel } from '@material-ui/core';
import ImageDropzone from "../../components/ImageDropzone/ImageDropzone";
import ImageDisplayCard from "../../components/ImageDisplayCard/ImageDisplayCard";



const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const Import = () => {
    const classes = useStyles();

    const [filesUploaded, setFilesUploaded] = useState([]); // Files to be uploaded to photoanalysisserver
    const [modelsAvailable, setModelsAvailable] = useState([]);  // Models available from the photoanalysisserver
    const [modelsToUse, setModelsToUse] = useState([]);  // Models for the photoanalysisserver to use on uploads


    useEffect(() => {
        axios.get('http://localhost:5000/models')
            .then((response) => {
                setModelsAvailable(response.data['models']);
            }, (error) => {
                console.log('Unable to connect to server or no models available.');
            });
    }, []);


    function toggleAddModelToUse(modelName) {
        if (modelsToUse.includes(modelName, 0)) {
            modelsToUse.splice(modelsAvailable.indexOf(modelName), 1);
            setModelsToUse(modelsToUse);
        } else {
            modelsToUse.push(modelName);
            setModelsToUse(modelsToUse);
        }
    }


    function uploadImages() {

        const url = 'http://localhost:5000/predict';
        const formData = new FormData();
        for (let i = 0; i < filesUploaded.length; i++) {
            formData.append('images', filesUploaded[i]);
        }
        for (let i = 0; i < modelsToUse.length; i++) {
            formData.append('models', modelsToUse[i]);
        }
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        axios.post(url, formData, config).then((response) => console.log(response.data.images));

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
                    <ImageDropzone filelistfunction={setFilesUploaded} />
                </Grid>

                {modelsAvailable.length > 0 &&
                    <FormGroup row={false}>
                        {modelsAvailable.map((modelName) => (
                            <FormControlLabel
                                key={modelName}
                                control={<Checkbox onChange={() => toggleAddModelToUse(modelName)} />}
                                label={modelName}
                            />
                        ))}
                    </FormGroup>
                }


                <Grid marginBottom={2}>
                    <Button variant="contained" color="primary" type="submit" onClick={uploadImages} disabled={filesUploaded.length === 0}>Upload Images for Processing</Button>
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
                                    <ImageDisplayCard title={fileName.name} />
                                </Grid>
                            ))
                        }
                    </Grid>
                }

            </Grid>
        </div>
    );
};

export default Import;
