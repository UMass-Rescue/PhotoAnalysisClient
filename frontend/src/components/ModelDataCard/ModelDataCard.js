import React from 'react';
import Typography from '@material-ui/core/Typography';
import ExampleModel from '../../components/Models/ExampleModel';
import ExampleModel2 from 'components/Models/ExampleModel2';



function ModelDataCard(props) {

    return (
        <div>
            {props.example_model &&
            <ExampleModel data={props.example_model}/>
            }
            {props.example_model2 &&
            <ExampleModel2 data={props.example_model2}/>
            }
            <Typography variant="h5">{props.description}</Typography>
        </div>
    );
}

export default ModelDataCard;