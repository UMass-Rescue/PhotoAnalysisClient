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


function SceneDetect(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const modelName = "Scene Detection"

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
                            <Table aria-label="simple table" size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Location Type</TableCell>
                                        <TableCell>Likelihood</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.keys(props.data['Category Confidence']).map((key, index) => (
                                    <TableRow key={key}>
                                        <TableCell component="th" scope="row" align="center">
                                            {key}
                                        </TableCell>
                                        <TableCell>
                                            {(parseFloat(props.data['Category Confidence'][key])*100).toFixed(2)}%    
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        
                        <br />

                        <TableContainer component={Paper}>
                            <Table aria-label="simple table" size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Location Attributes</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.keys(props.data['Scene Attributes']).map((key, index) => (
                                    <TableRow key={key}>
                                        <TableCell align="center">
                                            {props.data['Scene Attributes'][key]}
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
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

export default SceneDetect;