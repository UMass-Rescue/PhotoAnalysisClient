import React from 'react';
import Typography from '@material-ui/core/Typography';
import ExampleModel from '../../components/Models/ExampleModel';
import ExampleModel2 from 'components/Models/ExampleModel2';
import AgePredict from 'components/Models/AgePredict';
import SceneDetect from 'components/Models/SceneDetect';



function ModelDataCard(props) {

    return (
        <div>
            {props.example_model &&
            <ExampleModel data={props.example_model}/>
            }
            {props.example_model2 &&
            <ExampleModel2 data={props.example_model2}/>
            }
            {props.age_predict && 
            <AgePredict data={props.age_predict} />
            }
            {props.scene_detection &&
            <SceneDetect data={props.scene_detection} />
            }
            <Typography variant="h5" component={'span'}>{props.description}</Typography>
        </div>
    );
}

export default ModelDataCard;