import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import { Button, ButtonGroup, CardContent, Grid, Typography } from '@material-ui/core';
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
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

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

    const [currentPage, setCurrentPage] = useState(0);
    const [pagesTotal, setPagesTotal] = useState(0);
    const [imageData, setImageData] = useState({});

    // This will run initially on page load
    useEffect(() => {
        // Get total number of pages of images
        axios.request({
            url: baseurl + api['user_images'],
            method: 'get',
            headers: { 'Authorization': 'Bearer ' + Auth.token }
        }).then((response) => {
            setPagesTotal(response.data['num_pages']);
            if (response.data['num_pages'] > 0) {
                setCurrentPage(1);
            }
        });
    }, []);

    useEffect(() => {
        // Load in the image model data from the server

        setImageData({});

        let imageHashes = [];
        axios.request({
            url: baseurl + api['user_images'] + '?page_id=' + currentPage.toString(),
            method: 'get',
            headers: { 'Authorization': 'Bearer ' + Auth.token }
        }).then((response) => {
            if (response.data['status'] === 'success') {
                imageHashes = [...response.data['images']];

                let imageResults = {};
                imageHashes.forEach(hash => {
                    axios.request({ url: baseurl + api['image_result'] + hash, method: 'get', headers: { 'Authorization': 'Bearer ' + Auth.token } })
                        .then((response) => {
                            if (response.data['models']) {
                                imageResults[response.data['filename']] = response.data['models'];
                                let keyValue = response.data['filename'];
                                let newValue = response.data['models'];
                                setImageData(prevDict => ({ ...prevDict, [keyValue]: newValue }));
                            }
                        }).catch((error) => {
                            if (error.response) {
                                console.log(error);
                            } else {
                                console.log('WARNING: Unable to load image hash: ' + hash);
                            }
                        });

                });
            }
        });
    }, [currentPage]);


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
                    <Grid item xs={6}>
                        <ImageInformationCard title="Current Page" description={currentPage} />
                    </Grid>

                    <Grid item xs={6}>
                        <ImageInformationCard title="Number of Pages" description={pagesTotal} />
                    </Grid>

                    {pagesTotal > 0 &&
                        <Grid item md={12}>

                            <Grid
                                container
                                spacing={0}
                                direction="column"
                                alignItems="center"
                                justify="center"
                            >

                                <Grid item xs={4}>
                                    <Card style={{ height: '8vh' }}>
                                        <CardContent>
                                            <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                                                {currentPage > 1 ?
                                                    <Button onClick={() => setCurrentPage(currentPage - 1)}><NavigateBeforeIcon />Previous Page</Button>
                                                    :
                                                    <Button disabled><NavigateBeforeIcon />Previous Page</Button>
                                                }



                                                {currentPage < pagesTotal ?
                                                    <Button onClick={() => setCurrentPage(currentPage + 1)}>Next Page <NavigateNextIcon /></Button>
                                                    :
                                                    <Button disabled>Next Page <NavigateNextIcon /></Button>
                                                }
                                            </ButtonGroup>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                    {pagesTotal > 0 ?
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
                    :
                    <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    >
                        <Typography variant="h2" color={'error'} item xs={12}>
                            No Images Available.
                        </Typography>
                    </Grid>
                    }
                </Grid>
            </Grid>
        </div>
    );
};

export default Review;
