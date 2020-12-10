import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { ButtonGroup, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';


function ExampleModel(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const modelName = "Example Model"

    return (
        <div>
            <ButtonGroup  variant="outlined" color="secondary">
                <Button onClick={handleClickOpen}>
                    {modelName}
                </Button>
            </ButtonGroup>
            <Dialog 
                maxWidth='lg'
                fullWidth={true}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <Typography variant="h3" component={'span'}>
                        {modelName}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Category</TableCell>
                                        <TableCell >Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {Object.keys(props.data)[0]}
                                        </TableCell>
                                        <TableCell>
                                            {props.data[Object.keys(props.data)[0]]}    
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                </DialogContent>
                <DialogActions>
                    <ButtonGroup color="primary">
                        <Button onClick={handleClose} autoFocus>
                            Close
                        </Button>
                    </ButtonGroup>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ExampleModel;