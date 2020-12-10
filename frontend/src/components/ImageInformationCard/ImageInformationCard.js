import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ExampleModel from '../../components/Models/ExampleModel';
import ExampleModel2 from 'components/Models/ExampleModel2';
import AgePredict from 'components/Models/ExampleModel2';
import { Button } from '@material-ui/core';


const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
        textAlign: 'left',
    },
    pos: {
        marginBottom: 12,  
    },
});


function ImageInformationCard(props) {

    const classes = useStyles();



    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} gutterBottom>
                    {props.title}
                </Typography>
                <Typography variant="h5">
                    {props.description}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default ImageInformationCard;