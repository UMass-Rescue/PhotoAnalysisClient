import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {makeStyles} from '@material-ui/styles';
import {CardContent, Grid, Typography} from '@material-ui/core';
import ImageInformationCard from "../../components/ImageInformationCard/ImageInformationCard";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import ModelDataCard from "../../components/ModelDataCard/ModelDataCard";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import { api, Auth, baseurl } from 'api';


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4),
        overflowX: 'hidden',
    },
    reviewTable: {
        backgroundColor: 'white'
    },
    searchField: {
        width: '70%',
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
            axios.request({url: baseurl + api['image_result'] + hash, method: 'get', headers: {'Authorization': 'Bearer ' + Auth.token}})
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
                    justify="center"
                    direction="row"
                    spacing={4}
                    style={{
                        marginBottom: '2em',
                    }}
                >
                    <Grid item xs={12}>
                        <ImageInformationCard title="Total Images Uploaded" description={imagesTotal}/>
                    </Grid>

                    <Grid item md={12}>
                        <Card>
                            <CardContent>
                                <TextField
                                    id="search"
                                    label="Search"
                                    className={classes.searchField}
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item md={12}>
                        <TableContainer className={classes.reviewTable}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Image</TableCell>
                                        <TableCell>Models</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.keys(imageData).map((key, index) => (
                                        <TableRow key={key}>
                                            <TableCell component="th" scope="row">
                                                {key}
                                            </TableCell>
                                            <TableCell>
                                                <ModelDataCard {...imageData[key]} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default Review;
