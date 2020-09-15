import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {makeStyles} from '@material-ui/styles';
import {Grid, Typography} from '@material-ui/core';
import ImageInformationCard from "../../components/ImageInformationCard/ImageInformationCard";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    }
}));


const Review = () => {
    const classes = useStyles();

    const [imagesTotal, setImagesTotal] = useState('n/a');
    const [imagesProcessed, setImagesProcessed] = useState('n/a');
    const [imagesProcessing, setImagesProcessing] = useState('n/a');
    const [imagesErrored, setImagesErrored] = useState('n/a');
    const [imageData, setImageData] = useState({'Status': 'Empty'});

    useEffect(() => {
        axios.get('http://localhost:5057/images')
            .then((response) => {
                setImagesTotal(response.data['imagesTotal']);
                setImagesProcessed(response.data['imagesProcessed']);
                setImagesProcessing(response.data['imagesProcessing']);
                setImagesErrored(response.data['imagesErrored']);
                setImageData(response.data['images']);
                console.log("Image Data:");
                console.log(imageData);
            });
    }, []);



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
