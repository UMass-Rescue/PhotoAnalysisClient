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
    }
}));


const Review = () => {
    const classes = useStyles();

    // General Image Data from Server
    const [pagesTotal, setPagesTotal] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [numImagesTotal, setNumImagesTotal] = useState(0);
    const [modelList, setModelList] = useState({
        model1: ['a', 'b', 'c'], 
        model2: ['d', 'e', 'f'],
        bigModel: ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh']
    });

    // Image Result Table
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Searching
    const [generalSearchQuery, setGeneralSearchQuery] = useState('');
    const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
    const [advancedSearchFilter, setAdvancedSearchFilter] = useState({});
    const columns = useState([
        { field: 'file_names', headerName: 'File Names', width: 300 },
        { field: 'users', headerName: 'Users', width: 300 },
        { field: 'hash_md5', headerName: 'MD5 Hash', width: 250, sortable: false },
    ]);

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
                                        <TextField 
                                            variant="outlined" 
                                            fullWidth 
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
                            <TextField label="General Search" variant='outlined' defaultValue={generalSearchQuery}></TextField>
                        </Grid>

                        <Grid item xs={12}><Divider /></Grid>

                        <Grid item xs={12}>
                            <TextField label="Search Models" style={{width: '50%'}}></TextField>
                        </Grid>


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
                    <Button onClick={() => setAdvancedSearchOpen(false)} color="primary">
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
