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

    
    // Set image total from localstorage
    const [imagesTotal, setImagesTotal] = useState(0);
    const [imageData, setImageData] = useState({});
  
    useEffect(() => {
        // Update total images from localstorage
        setImagesTotal(localStorage.getItem('images') ? JSON.parse(localStorage.getItem('images')).length : 0);

        // Load in the image model data from the server
        let imageHashes = JSON.parse(localStorage.getItem('images')) || [];
        let imageResults = {};
        imageHashes.forEach(hash => {
            axios.get('http://localhost:5000/predict/'+hash)
            .then((response) => {
                if (response.data['models']) {
                    imageResults[response.data['filename']] = response.data['models'];
                    let keyValue = response.data['filename'];
                    let newValue = response.data['models'];
                    setImageData(prevDict => ({...prevDict, [keyValue]: newValue}));
                }
            }).catch((error) => {
                if (error.response) {
                    console.log(error);
                } else {
                    console.log('WARNING: Unable to load image hash: ' + hash);
                }
            });

        });
    }, []);


    return (
        <div className={classes.root}>
            <Grid
                container
                spacing={6}
                direction="column"
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
                    spacing={4}
                    style={{
                        marginBottom: '2em',
                    }}
                >
                    <Grid item xs={6}>
                        <ImageInformationCard title="Total Images Uploaded" description={imagesTotal}/>
                    </Grid>
                    
                </Grid>

                <Grid
                    container
                    justify="left"
                    direction="row"
                    spacing={4}
                >

                {Object.keys(imageData).map((key, index) => (
                    <Grid item xs={3} key={key}>
                        <ImageInformationCard title={key} {...imageData[key]} />
                    </Grid>
                ))}

                </Grid>

            </Grid>
        </div>
    );
};

export default Review;
