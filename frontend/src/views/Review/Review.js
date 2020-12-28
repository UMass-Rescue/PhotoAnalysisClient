import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import { Button, Card, CardContent, Grid, Input, TextField, Typography } from '@material-ui/core';
import ImageInformationCard from "../../components/ImageInformationCard/ImageInformationCard";
import { api, Auth, baseurl } from 'api';
import { DataGrid } from '@material-ui/data-grid';

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

    const [pagesTotal, setPagesTotal] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [numImagesTotal, setNumImagesTotal] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);


    const columns = [
        { field: 'file_names', headerName: 'File Names', width: 300 },
        { field: 'users', headerName: 'Users', width: 300 },
        { field: 'hash_md5', headerName: 'MD5 Hash', width: 250, sortable: false },
    ];

    // This will run initially on page load
    useEffect(() => {
        // Get total number of pages of images
        axios.request({
            url: baseurl + api['user_images'],
            method: 'get',
            headers: { 'Authorization': 'Bearer ' + Auth.token }
        }).then((response) => {
            setPagesTotal(response.data['num_pages']);
            setPageSize(response.data['page_size']);
            setNumImagesTotal(response.data['num_images']);
            console.log(response.data['num_images']);
        });
    }, []);

    useEffect(() => {
        // Load in the image model data from the server
        setLoading(true);

        let imageHashes = [];
        axios.request({
            url: baseurl + api['user_images'] + '?page_id=' + currentPage.toString(),
            method: 'get',
            headers: { 'Authorization': 'Bearer ' + Auth.token }
        }).then((response) => {
            if (response.data['status'] === 'success') {
                imageHashes = [...response.data['hashes']];

                let imageListHeaders = {
                    'Authorization': 'Bearer ' + Auth.token,
                    'content-type': 'application/json',
                }

                let newImageData = [];

                axios.request({
                    url: baseurl + api['image_result'],
                    method: 'post',
                    data: imageHashes,
                    headers: imageListHeaders,
                }).then((response) => {

                    response.data.map((imageModelResult) => {
                        if (imageModelResult['status'] === 'success') {
                            let rowData = {
                                id: imageModelResult['hash_md5'],
                                hash_md5: imageModelResult['hash_md5'],
                                file_names: imageModelResult['file_names'].join(', '),
                                users: imageModelResult['users'],
                            };

                            newImageData.push(rowData);
                        }
                    });

                    setRows(newImageData);
                }).catch((error) => {
                    if (error.response) {
                        console.log(error);
                    } else {
                        console.log('ERROR: Unable to load image model data.');
                    }
                });

            }
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
            } else {
                console.log('Unable to connect to server to load images.');
            }
        });
        setLoading(false);
    }, [currentPage]);

    return (
        <div className={classes.root}>
            <Grid
                container
                spacing={6}
                direction="column"
            >

                <Grid
                    container
                    justify="center"
                    direction="row"
                    spacing={2}
                    style={{
                        marginBottom: '2em',
                    }}
                >
                    <Grid item xs={6}>
                        <ImageInformationCard title="Current Page" description={currentPage} />
                    </Grid>

                    <Grid item xs={6}>
                        <ImageInformationCard title="Number of Images" description={numImagesTotal} />
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Grid justify="space-between" container spacing={3} alignItems="center">
                                    <Grid item xs={8}>
                                        <TextField variant="outlined" fullWidth label='Search Image and Model Data'></TextField>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button color='secondary' fullWidth variant='contained'>Search</Button>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button color='primary' fullWidth variant='contained'>Advanced</Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {pagesTotal > 0 ?
                        <Grid
                            item
                            md={12}
                            style={{
                                height: '100vh',
                                width: '100%'
                            }}
                        >

                            <DataGrid
                                page={currentPage}
                                onPageChange={(params) => {
                                    setCurrentPage(params.page);
                                }}
                                pageSize={pageSize}
                                rowCount={numImagesTotal}
                                rows={rows}
                                columns={columns}
                                loading={loading}
                                pagination
                                paginationMode="server"
                            />

                        </Grid>
                        :
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                        >
                            <Grid item xs={12}>
                                <Typography variant="h2" color={'error'} >
                                    No Images Available.
                                </Typography>
                            </Grid>

                        </Grid>
                    }
                </Grid>
            </Grid>
        </div>
    );
};

export default Review;
