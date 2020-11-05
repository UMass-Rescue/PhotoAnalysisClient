import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { Grid, Typography, Button, Checkbox, FormGroup, FormControlLabel, Paper, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import ImageDropzone from "../../components/ImageDropzone/ImageDropzone";
import ImageDisplayCard from "../../components/ImageDisplayCard/ImageDisplayCard";



const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    modelSelectorCard: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '1em',
        paddingBottom: '1em',
        paddingLeft: '10vw',
        paddingRight: '10vw',
        marginBottom: '1em',
    }
}));

const Import = () => {
    const classes = useStyles();

    const [filesUploaded, setFilesUploaded] = useState([]); // Files to be uploaded to photoanalysisserver
    const [modelsAvailable, setModelsAvailable] = useState([]);  // Models available from the photoanalysisserver
    const [modelsToUse, setModelsToUse] = useState([]);  // Models for the photoanalysisserver to use on uploads
    const [open, setOpen] = useState(false); // Handles state of image upload snackbar


    useEffect(() => {
        axios.get('http://localhost:5000/models')
            .then((response) => {
                setModelsAvailable(response.data['models']);
            }, (error) => {
                console.log('Unable to connect to server or no models available.');
            });
    }, []);


    function toggleAddModelToUse(modelName) {
        if (modelsToUse.indexOf(modelName) > -1) {
            let newModels = [...modelsToUse]
            newModels.splice(modelsToUse.indexOf(modelName), 1);
            setModelsToUse(newModels);
        } else {
            let newModels = [...modelsToUse]
            newModels.push(modelName);
            setModelsToUse(newModels);
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
        axios.post(url, formData, config).then((response) => {
            setFilesUploaded([]); // Clear file list
            setOpen(true); // Display success message

            // Correctly Update Locally Stored Image Hashes
            let storedImageHashes = JSON.parse(localStorage.getItem('images')) || [];
            let combinedImageHashes = storedImageHashes.concat(response.data.images);
            let newImageHashes = combinedImageHashes.filter((item, i, ar) => ar.indexOf(item) === i);
            localStorage.setItem('images', JSON.stringify(newImageHashes));
        });

    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };


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
                    <Typography variant="h3" mt={5}>
                        Import Images for Processing
                    </Typography>
                </Grid>

                {/* Display Image Drag-And-Drop Area For Upload  */}
                <Grid item xs={12}>
                    <ImageDropzone filelistfunction={setFilesUploaded} />
                </Grid>

                <Paper elevation={1} className={classes.modelSelectorCard}>
                    {modelsAvailable.length > 0 &&
                        <FormGroup row={false}>
                            <Typography variant="h4"><strong>Select Models</strong></Typography>
                            {modelsAvailable.map((modelName) => (
                                <FormControlLabel
                                    key={modelName}
                                    control={<Checkbox onChange={() => toggleAddModelToUse(modelName)} />}
                                    label={modelName.replace('_', ' ')}
                                />
                            ))}
                        </FormGroup>
                    }
                    {modelsAvailable.length === 0 &&
                        <Typography type='h4' color='error'><strong>No Models Available</strong></Typography>
                    }
                </Paper>

                <Grid>
                    <Button variant="contained" color="primary" type="submit" onClick={uploadImages} disabled={filesUploaded.length === 0 || modelsToUse.length === 0}>Upload Images for Processing</Button>
                </Grid>

                <br />

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


                            <Typography variant="h4" style={{ marginTop: '2.5em', marginBottom: '1em', borderTop: '0.1em solid black', padding: '1.5em' }}>
                                Image Upload Results
                            </Typography>

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

                <Snackbar open={open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                    <Alert onClose={handleSnackbarClose} severity="success">
                        <Typography variant="h5" component="h4">Images Successfully Uploaded For Processing</Typography>
                    </Alert>
                </Snackbar>


            </Grid>
        </div>
    );
};

export default Import;
