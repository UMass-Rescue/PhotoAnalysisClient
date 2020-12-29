import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { ButtonGroup, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, TextField } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import BlurCircularIcon from '@material-ui/icons/BlurCircular';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Alert from '@material-ui/lab/Alert';
import SearchIcon from '@material-ui/icons/Search';

function ModelSearchComponent(props) {

    const [classesToUse, setClassesToUse] = useState([]);
    const [classesToDisplay, setClassesToDisplay] = useState([]);

    const [showExpandedView, setShowExpandedView] = useState(false);
    const [searchFilter, setSearchFilter] = useState('');

    const modelName = props.modelName;
    const modelClasses = [...props.modelClasses];
    const useLargeModelView = modelClasses.length > 5
    const callbackFunction = props.onClassSelect;

    // Styles
    const smallListStyle = {
        maxHeight: '35vh',
        overflow: 'auto'
    }
    const largeListStyle = {
        height: '35vh',
        overflow: 'auto'
    }

    useEffect(() => {
        // On page load display all models
        setClassesToDisplay([...modelClasses]);

        // Model classes is a constant, don't check it
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // Update the classes with the search filter
        if (searchFilter.length > 0) {
            let newClassList = [...modelClasses];
            newClassList = newClassList.filter(modelClassName => modelClassName.includes(searchFilter));
            setClassesToDisplay(newClassList);
        } else {
            setClassesToDisplay(modelClasses);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchFilter])


    function addAllClassesToUse() {
        setClassesToUse([...modelClasses]); // Update selected model classes
        callbackFunction([...modelClasses]); // Send callback to parent
    }

    function removeAllClassesToUse() {
        setClassesToUse([]); // Update selected model classes
        callbackFunction([]); // Send callback to parent
    }


    function addClassToUse(modelClass) {
        let newClassList = [...classesToUse];
        newClassList.push(modelClass);
        setClassesToUse(newClassList); // Update selected model classes
        callbackFunction(newClassList); // Send callback to parent
    }

    function removeClassToUse(modelClass) {
        let newClassList = [...classesToUse];
        newClassList.splice(newClassList.indexOf(modelClass), 1);
        setClassesToUse(newClassList);  // Update selected model classes
        callbackFunction(newClassList); // Send callback to parent
    }


    return (
        <Card>
            <CardContent style={{padding: '1em'}}>
                <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                >
                    <Typography variant='h5'>
                        {modelName}
                    </Typography>

                    { classesToUse.length > 0 &&
                    <Alert icon={<SearchIcon fontSize="small" />}  severity="error">
                        Selected
                    </Alert>
                    }

                    {/* Show the correct buttons corresponding to open/closed tray and selected items */}
                    <ButtonGroup color="primary" aria-label="outlined primary button group">

                        {showExpandedView ?
                            <IconButton onClick={(e) => {setShowExpandedView(false); setSearchFilter('');}}><ExpandLessIcon /></IconButton>
                        :
                            <IconButton onClick={(e) => setShowExpandedView(true)}><ExpandMoreIcon /></IconButton>
                        }

                        {classesToUse.length === 0 &&
                            <IconButton onClick={addAllClassesToUse}><RadioButtonUncheckedIcon /></IconButton>
                        }
                        {classesToUse.length > 0 && classesToUse.length < modelClasses.length && 
                            <IconButton onClick={removeAllClassesToUse}><BlurCircularIcon /></IconButton>
                        }
                        {classesToUse.length === modelClasses.length &&
                            <IconButton onClick={removeAllClassesToUse}><CheckCircleOutlineIcon /></IconButton>
                        }
                    </ButtonGroup>
                </Grid>

                { showExpandedView &&
                    <List dense style={useLargeModelView ? largeListStyle : smallListStyle}>
                        {useLargeModelView && 
                        <TextField 
                            variant="outlined" 
                            fullWidth={true} 
                            label='Search Classes'
                            style={{marginBottom: '1em'}}
                            onChange={(e) => setSearchFilter(e.target.value)}
                        ></TextField>
                        }

                    {classesToDisplay.map((modelClass) => (
                        <ListItem key={modelName + '-' + modelClass}>
                                <ListItemText>{modelClass}</ListItemText>
                                <ListItemSecondaryAction>
                                    {classesToUse.includes(modelClass) ?
                                        <IconButton edge="end" onClick={(e) => removeClassToUse(modelClass)}><CheckCircleOutlineIcon /></IconButton>
                                    :
                                        <IconButton edge="end" onClick={(e) => addClassToUse(modelClass)}><RadioButtonUncheckedIcon /></IconButton>
                                    }
                                </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                    </List> 
                }
            </CardContent>
        </Card>
    );
}

export default ModelSearchComponent;