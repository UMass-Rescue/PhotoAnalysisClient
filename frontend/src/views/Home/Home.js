import React from 'react';
import {makeStyles} from '@material-ui/styles';
import {Box, Grid, Typography} from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4),
        overflowX: 'hidden',
    },
    loginTopPadding: {
        paddingTop: '20vh',
    },
    loginGrid1: {
        backgroundColor: 'black',
    },
    loginGrid2: {
        backgroundColor: 'red',
    },
}));


const Home = () => {
    const classes = useStyles();


    // Set image total from localstorage

    return (
        <div className={classes.root}>
            <Box display={{ xs: 'none', sm: 'block' }} className={classes.loginTopPadding} xs={12}>
                
            </Box>

            <Grid
                container 
                direction="row"
                spacing={3}
                display="flex"
                justify="center"
            >

                <Grid item xs={4} className={classes.loginGrid1}>

                </Grid>

                <Grid item xs={4} className={classes.loginGrid2}>
                    <Typography variant="h2">
                        Home
                    </Typography>
                </Grid>
                <Grid item xs={4} className={classes.loginGrid1}>

                </Grid>

            </Grid>
        </div>
    );
};

export default Home;
