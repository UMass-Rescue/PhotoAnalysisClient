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

    // Table columns
    const columns = [
        { field: 'file_names', headerName: 'File Names', width: 300 },
        { field: 'users', headerName: 'Users', width: 300 },
        { field: 'hash_md5', headerName: 'MD5 Hash', width: 250, sortable: false },
    ];

    // This will run initially on page load
    useEffect(() => {

        // Get all available models that we can filter by
        axios.request({
            url: baseurl + api['model_result_list'],
            method: 'get',
            headers: { 'Authorization': 'Bearer ' + Auth.token }
        }).then((response) => {
            setModelList(response.data['models']);
        }).catch((error) => {
            if (error.response) {
                console.log("[Error] Initial model list load failure", error);
            } else {
                console.log("[Error] Initial model list load failure");
            }
        })

    }, []);

    // When we change the filter being used, we should reload the images that
    // are available with the filter applied
    useEffect(() => {

        /* ------------------------------------
        *  Loads the details on available images into client.
        *  This will take into account the filters applied from
        *  the basic/advanced search feature.
        **/
        let httpRequestDetails = {
            url: baseurl + api['user_images'],
            method: 'post',
            params: {'page_id': -1},
            headers: { 'Authorization': 'Bearer ' + Auth.token, 'content-type': 'application/json'}
        };

        if (Object.keys(advancedSearchFilter).length !== 0) {
            httpRequestDetails['data'] = {'searchFilter': advancedSearchFilter};
        }

        // First we request the list of image hashes on this page, then we load the data for those hashes
        axios.request(httpRequestDetails).then((response) => {
            if (response.data['status'] === 'success') {
                setPagesTotal(response.data['num_pages']);
                setPageSize(response.data['page_size']);
                setNumImagesTotal(response.data['num_images']);
                if (response.data['num_images'] > 0) {
                    setCurrentPage(1);
                } 
            }
        }).catch((error) => {
            if (error.response) {
                console.log("[Error] Image data detail load failure", error);
            } else {
                console.log("[Error] Image data detail load failure");
            }
        });
    }, [advancedSearchFilter])


    /* ------------------------------------
     *  Loads a page into the table.
     *  This will take into account the filters applied from
     *  the basic/advanced search feature.
    **/
    useEffect(() => {
        // Display loading circle on the table UI 
        setLoading(true);

        let imageHashes = [];

        // Generate page params and the body
        let httpRequestDetails = {
            url: baseurl + api['user_images'],
            method: 'post',
            params: {'page_id': currentPage.toString()},
            headers: { 'Authorization': 'Bearer ' + Auth.token, 'content-type': 'application/json'}
        };

        if (Object.keys(advancedSearchFilter).length !== 0) {
            httpRequestDetails['body'] = {'searchFilter': advancedSearchFilter};
        }

        // First we request the list of image hashes on this page, then we load the data for those hashes
        axios.request(httpRequestDetails).then((response) => {
            if (response.data['status'] === 'success') {
                imageHashes = [...response.data['hashes']];

                let newImageData = [];
                axios.request({
                    url: baseurl + api['image_result'],
                    method: 'post',
                    data: imageHashes,
                    headers: { 'Authorization': 'Bearer ' + Auth.token, 'content-type': 'application/json'},
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
                        console.log("[Error] Unable to load image model data", error);
                    } else {
                        console.log("[Error] Unable to load image model data");
                    }
                });

            }
        }).catch((error) => {  // If unable to connect to server to load image hashes
            if (error.response) {
                console.log("[Error] Unable to establish server connection", error.response);
            } else {
                console.log("[Error] Unable to establish server connection");
            }
        });
        setLoading(false);
    }, [currentPage, advancedSearchFilter])

    // Helper callback to set search parameters
    function updateSearchFilterFromModelCard(modelName, modelClasses) {
        if (modelClasses.length === 0) {
            let newClasses = {...advancedSearchFilter};
            delete newClasses[modelName];
            setAdvancedSearchFilter(newClasses);
        } else {
            setAdvancedSearchFilter({...advancedSearchFilter, [modelName]: modelClasses});
        }
    }


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
                                        onPageChange={(params) => {setCurrentPage(params.page)}}
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
                <DialogContent 
                    style={{height: '80vh', overflow: 'auto'}}
                >

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
                                    onClassSelect={(classList) => updateSearchFilterFromModelCard(modelName, classList)}
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
