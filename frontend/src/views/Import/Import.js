import React, {useState} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Grid, Typography} from '@material-ui/core';
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
                            >
                                <ImageDisplayCard title={fileName}/>
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
