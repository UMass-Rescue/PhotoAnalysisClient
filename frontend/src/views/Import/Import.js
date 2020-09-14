import React, {useState} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Grid, Typography} from '@material-ui/core';
import ImageDropzone from "../../components/ImageDropzone/ImageDropzone";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    }
}));


const Import = () => {
    const classes = useStyles();

    const [filesUploaded, setFilesUploaded] = useState(["Hello", "World"]);


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
                <Grid item xs={3}>
                    <Typography variant="h2" mt={5}>
                        Add Images to Process
                    </Typography>
                </Grid>

                {/* Display Image Drag-And-Drop Area For Upload  */}
                <Grid item xs={3}>
                    <ImageDropzone filelistfunction={setFilesUploaded} />
                </Grid>

                {/* Display List of All File Names */}
                <Grid item xs={3}>
                    {filesUploaded.map( (fileName) => (
                        <p key={fileName}>{fileName}</p>
                    ))}
                </Grid>

            </Grid>
        </div>
    );
};

export default Import;
