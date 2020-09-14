import React from 'react';
import {makeStyles} from '@material-ui/styles';
import {Grid, Typography} from '@material-ui/core';
import ImageInformationCard from "../../components/ImageInformationCard/ImageInformationCard";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    }
}));


function fetchImageData() {
    // TODO: API Call Returns # total images
    // TODO: API Call Returns # Processed images
    // TODO: API Call Returns # Processing Images
    // TODO: API Call Returns # Errored Images

    return [ [2], [2], [0], [0],
        [
            {
                name: 'image1',
                size: 256
            },
            {
                name: 'image2',
                size: 512
            }
        ]
    ];
}


const Review = () => {
    const classes = useStyles();

    const [imagesTotal, imagesProcessed, imagesProcessing, imagesErrored, imageData] = fetchImageData();


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
                        Review Images
                    </Typography>
                </Grid>

                <Grid
                    container
                    justify="space-evenly"
                    direction="row"
                    spacing={3}
                >
                    <Grid item xs={3}>
                        <ImageInformationCard title={"# Images Uploaded"} description={imagesTotal} />
                    </Grid>
                    <Grid item xs={3}>
                        <ImageInformationCard title={"# Images Processed"} description={imagesProcessed} />
                    </Grid>
                    <Grid item xs={3}>
                        <ImageInformationCard title={"# Images Processing"} description={imagesProcessing} />
                    </Grid>
                    <Grid item xs={3}>
                        <ImageInformationCard title={"# Images Errored"} description={imagesErrored} />
                    </Grid>
                </Grid>

            </Grid>
        </div>
    );
};

export default Review;
