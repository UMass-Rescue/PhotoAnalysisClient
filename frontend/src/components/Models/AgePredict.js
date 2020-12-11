import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';


function AgePredict(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const modelName = "Age Prediction"

    return (
        <div>
            <Button variant="outlined" color="secondary" onClick={handleClickOpen}>
                {modelName}
            </Button>
            <Dialog 
                maxWidth='lg'
                fullWidth={true}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <Typography variant="h3">
                        {modelName}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center"><Typography variant="h3">Age Range</Typography></TableCell>
                                        <TableCell ><Typography variant="h3">{props.data[Object.keys(props.data)[0]]}</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                        </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AgePredict;