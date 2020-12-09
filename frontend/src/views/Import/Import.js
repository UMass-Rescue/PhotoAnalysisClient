import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';
import axios from 'axios';
import {
    Grid,
    Typography,
    Button,
    Checkbox,
    FormControlLabel,
    CardContent
} from '@material-ui/core';
import ImageDropzone from "../../components/ImageDropzone/ImageDropzone";
import Card from "@material-ui/core/Card";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RemoveIcon from '@material-ui/icons/Remove';
import TableHead from "@material-ui/core/TableHead";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import TableContainer from "@material-ui/core/TableContainer";
import Box from "@material-ui/core/Box";

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
    },
    modelSelectorContainer: {
        width: '100%',
        height: '55vh',
        borderRadius: '0.6em',
    },
    modelSelectorTable: {
        overflow: 'auto',
        maxHeight: '45vh',
    },
    imageListContainer: {
        width: '100%',
        height: '55vh',
        borderRadius: '0.6em',
    },
    imageListTable: {
        overflow: 'auto',
        maxHeight: '45vh',
    },
    uploadButtonContainer: {
        width: '100%',
        height: '10vh',
        paddingTop: '2vh',
        borderRadius: '0.6em',
    },
    headerGridCard: {
        height: '6vh',
    }
}));

const Import = () => {
    const classes = useStyles();

    const [filesToUpload, setFilesToUpload] = useState([]); // Files to be uploaded to photoanalysisserver
    const [filesUploaded, setFilesUploaded] = useState([]); // Files successfully uploaded to server
    const [modelsAvailable, setModelsAvailable] = useState([]);  // Models available from the photoanalysisserver
    const [modelsToUse, setModelsToUse] = useState([]);  // Models for the photoanalysisserver to use on uploads
    const [open, setOpen] = useState(false); // Handles state of image upload snackbar


    useEffect(() => {
        axios.get('http://localhost:5000/model/list')
            .then((response) => {
                setModelsAvailable(response.data['models']);
            }, (error) => {
                console.log('Unable to connect to server or no models available.');
            });
    }, []);


    function addFilesToUpload(files) {
        setFilesToUpload([...filesToUpload, ...files]);
    }


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
        let currIndex = 0;
        while (currIndex < filesToUpload.length) {
            for (let imageCount = 0; imageCount < 3; imageCount++) {

                const formData = new FormData();
                let fileNames = [];
                let currPlus3 = currIndex + 3;
                for (currIndex; currIndex < currPlus3; currIndex++) {
                    if (currIndex >= filesToUpload.length) {
                        break;
                    }
                    formData.append('images', filesToUpload[currIndex]);
                    fileNames.push(filesToUpload[currIndex].name);
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
                    setOpen(true); // Display success message
                    setFilesUploaded(curr => [...curr, ...fileNames]);
                    console.log('Updating!!');
                    let storedImageHashes = JSON.parse(localStorage.getItem('images')) || [];
                    let combinedImageHashes = storedImageHashes.concat(response.data.images);
                    let newImageHashes = combinedImageHashes.filter((item, i, ar) => ar.indexOf(item) === i);
                    localStorage.setItem('images', JSON.stringify(newImageHashes));
                });
            }
            console.log(filesUploaded);

        }
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    return (
        <div className={classes.root}>

            <ImageDropzone filelistfunction={addFilesToUpload}/>

            <div style={{marginTop: '1em'}}>
                <Grid
                    container
                    spacing={2}
                    display="flex"
                >

                    {/*Header Card: Images*/}
                    <Grid item md={4} >
                        <Box display={{ xs: "none", lg: "block" }}>
                            <Card className={classes.headerGridCard}>
                                <CardContent>
                                    <Typography variant="h3" style={{marginBottom: '1em'}}>
                                        1. Add Images
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Grid>

                    {/*Header Card: Models*/}
                    <Grid item md={4} >
                        <Box display={{ xs: "none", lg: "block" }}>
                            <Card className={classes.headerGridCard}>
                                <CardContent>
                                    <Typography variant="h3" style={{marginBottom: '1em'}}>
                                        2. Choose Models
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Grid>

                    {/*Header Card: Upload*/}
                    <Grid item md={4} >
                        <Box display={{ xs: "none", lg: "block" }}>
                            <Card className={classes.headerGridCard}>
                                <CardContent>
                                    <Typography variant="h3" style={{marginBottom: '1em'}}>
                                        3. Upload for Processing
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Grid>

                    {/*Review Images*/}
                    <Grid item md={4}>
                        <Card className={classes.imageListContainer}>
                            <CardContent>
                                <Typography variant="h5" style={{marginBottom: '1em'}}>
                                    Images
                                </Typography>

                                <TableContainer className={classes.imageListTable}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Filename</TableCell>
                                                <TableCell>Upload Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filesToUpload.map( (fileObject) => (
                                                <TableRow key={fileObject.name}>
                                                    <TableCell component="th" scope="row">
                                                        {fileObject.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {(filesUploaded.includes(fileObject.name) &&
                                                            <CheckCircleOutlineIcon />
                                                        ) ||
                                                        <RemoveIcon />
                                                        }

                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/*Select Models*/}
                    <Grid item md={4}>
                        <Card className={classes.modelSelectorContainer}>
                            <CardContent>
                                <Typography variant="h5" style={{marginBottom: '1em'}} >
                                    Choose Models For Processing
                                </Typography>

                                <Table className={classes.modelSelectorTable} stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Model</TableCell>
                                            <TableCell>Selected</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {modelsAvailable.map( (modelName) => (
                                            <TableRow key={modelName}>
                                                <TableCell component="th" scope="row">
                                                    {modelName.replaceAll('_', ' ')}
                                                </TableCell>
                                                <TableCell>
                                                    <FormControlLabel
                                                        control={<Checkbox onChange={() => toggleAddModelToUse(modelName)} />}
                                                        label={''}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                            </CardContent>
                        </Card >
                    </Grid>

                    {/* Upload Images*/}
                    <Grid item md={4}>
                        <Card className={classes.uploadButtonContainer}>



                            <CardContent>
                                <Button
                                    variant="contained" color="primary" type="submit"
                                    onClick={uploadImages} disabled={filesToUpload.length === 0 || modelsToUse.length === 0}
                                    style={{marginLeft: '30%', width: '40%'}}
                                >
                                    Upload Images
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>


                </Grid>

                <Snackbar open={open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                    <Alert onClose={handleSnackbarClose} severity="success">
                        <Typography variant="h5" component="h4">Images Successfully Uploaded</Typography>
                    </Alert>
                </Snackbar>

            </div>
            
        </div>
    );
};

export default Import;
