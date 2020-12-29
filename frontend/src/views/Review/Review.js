import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import { Button, ButtonGroup, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography } from '@material-ui/core';
import ImageInformationCard from "../../components/ImageInformationCard/ImageInformationCard";
import { api, Auth, baseurl } from 'api';
import { DataGrid } from '@material-ui/data-grid';
import ModelSearchComponent from 'components/ModelSearchComponent/ModelSearchComponent';

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
    },
}));


const Review = () => {
    const classes = useStyles();

    // General Image Data from Server
    const [pagesTotal, setPagesTotal] = useState(0); // Number of pages in table
    const [pageSize, setPageSize] = useState(0); // Number of images on 1 page of table
    const [numImagesTotal, setNumImagesTotal] = useState(0); // Total images we can see
    const [modelList, setModelList] = useState({});  // Stores all models we can search by

    // Image Result Table
    const [loading, setLoading] = useState(false); // Loading bar showing in table
    const [rows, setRows] = useState([]); // Current data being shown in table
    const [currentPage, setCurrentPage] = useState(1); // Current page of table

    // Searching
    const [generalSearchQuery, setGeneralSearchQuery] = useState(''); // String search query
    const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false); // Advanced search dialog open
    const [advancedSearchFilter, setAdvancedSearchFilter] = useState({}); // Advanced search filter
    const [usingFilter, setUsingFilter] = useState(false); // If results are filtered currently

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
            method: 'post',
            params: {'page_id': currentPage.toString()},
            headers: { 'Authorization': 'Bearer ' + Auth.token}
        }).then((response) => {
            setPagesTotal(response.data['num_pages']);
            setPageSize(response.data['page_size']);
            setNumImagesTotal(response.data['num_images']);
        });

        // Get all available models that we can filter by
        axios.request({
            url: baseurl + api['model_result_list'],
            method: 'get',
            headers: { 'Authorization': 'Bearer ' + Auth.token }
        }).then((response) => {
            setModelList(response.data['models']);
        });

    }, []);

    useEffect(() => {
        let paramsToSend = {
            'page_id': currentPage.toString(),
            'search_filter': JSON.stringify(advancedSearchFilter)
        };
        console.log(advancedSearchFilter);
        axios.request({
            url: baseurl + api['user_images'],
            method: 'post',
            params: paramsToSend,
            headers: { 'Authorization': 'Bearer ' + Auth.token}
        }).then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.log('No');
        });
    }, [advancedSearchFilter])

    useEffect(() => {
        // Load in the image model data from the server
        setLoading(true);

        let imageHashes = [];
        let paramsToSend = {
            'page_id': currentPage.toString()
        };
        if (advancedSearchFilter) {
            paramsToSend['search_filter'] = JSON.stringify(advancedSearchFilter);
        }
        axios.request({
            url: baseurl + api['user_images'],
            method: 'post',
            params: paramsToSend,
            headers: { 'Authorization': 'Bearer ' + Auth.token}
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

                    response.data.forEach((imageModelResult) => {
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
                    setRows([...newImageData]);
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
                                        <TextField 
                                            variant="outlined" 
                                            fullWidth={true} 
                                            label='Search Image and Model Data'
                                            onChange={(e) => {setGeneralSearchQuery(e.target.value)}}
                                        ></TextField>
                                    </Grid>
                                    <Grid item xs={4}>

                                        <ButtonGroup size='large'>
                                            <Button color='secondary' variant='contained'>Search</Button>
            
                                            <Button
                                                color='primary'
                                                variant='contained'
                                                onClick={() => setAdvancedSearchOpen(true)}
                                            >
                                                Advanced
                                            </Button>
                                        </ButtonGroup>
                                        
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {pagesTotal > 0 ?
                        <Grid
                            item
                            sm={12}
                        >
                            <Card>
                                <CardContent style={{height: '60vh'}}>
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
                                </CardContent>
                            </Card>
                            
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

            <Dialog
                open={advancedSearchOpen}
                onClose={() => setAdvancedSearchOpen(false)}
                aria-labelledby="form-dialog-title"
                fullWidth={true}
                maxWidth = {'lg'}
            >
                <DialogTitle id="form-dialog-title">Advanced Search</DialogTitle>
                <DialogContent style={{height: '80vh', overflow: 'auto'}}>

                    <Grid
                        container
                        spacing={3}
                        display="flex"
                        justify="center"
                    >

                        <Grid item xs={8}>
                            <TextField label="General Search" variant='outlined' fullWidth={true} defaultValue={generalSearchQuery}></TextField>
                        </Grid>

                        <Grid item xs={12}><Divider /></Grid>

                        <Grid item xs={4}>
                            <TextField label="Search Models" fullWidth></TextField>
                        </Grid>


                        <Grid item xs={12}><Divider /></Grid>

                        {Object.keys(modelList).map( (modelName) => (
                            <Grid item xs={4} key={modelName}>
                                <ModelSearchComponent 
                                    modelName={modelName}
                                    modelClasses={modelList[modelName]}
                                    onClassSelect={(classList) => setAdvancedSearchFilter({...advancedSearchFilter, [modelName]: classList})}
                                /> 
                            </Grid>
                        ))}
                        


                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAdvancedSearchOpen(false)} color="primary" variant='contained'>
                        Cancel
                    </Button>
                    <Button color="secondary" variant={'contained'}>
                        Search
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default Review;
