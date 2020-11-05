import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {makeStyles} from '@material-ui/styles';
import {Button, Grid, Typography} from '@material-ui/core';
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
                            // let newKey = response.data['filename'];
                            // let newValue = response.data['models'];
                            // setImageData(prevDict => ({...prevDict, newKey: newValue}));
                        }
                    }).catch((error) => {
                        if (error.response) {
                            console.log(error);
                        } else {
                            console.log('WARNING: Unable to load image hash: ' + hash);
                        }
                    });
                });
                console.log(imageResults);
                // let newArray = JSON.parse(JSON.stringify(imageResults));
                // console.log(newArray);
                setImageData({imageResults});
    }, []);


    function showImageData() {
        console.log(imageData);
        console.log(Object.keys(imageData).length);
        setImagesTotal(imagesTotal+1);
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
                        <ImageInformationCard title={"# Images Uploaded"} description={imagesTotal}/>
                    </Grid>
                    
                </Grid>

                <Button onClick={showImageData}>Show</Button>

                <Grid
                    container
                    justify="space-evenly"
                    direction="row"
                    spacing={3}
                >

                {Object.keys(imageData['imageResults']).length}
                {Object.keys(imageData).map((key, index) => (
                    <Grid item xs={3} key={key}>
                        <p>{key}</p>
                    </Grid>
                ))}

                </Grid>

            </Grid>
        </div>
    );
};

export default Review;
