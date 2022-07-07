import React, { useState, useEffect } from 'react';
import TemplateSelection from './template_selection';
import NewTemplateForm from './new_template_form';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SelectedRows } from '../ob_table';
import { DisplayData } from "mui-datatables"
import { Template } from '../../../typings/papahana';
import OBBatchWriter from './ob_batch_writer';

interface Props {
    handle_close: Function; 
    rows: Array<object>
}

export interface State {
    id: string,
    formData: object,
    template: Template,
}


const steps = ['Select available template', 'Fill out template', 'Submit OB batch write'];

const WNCStepperDialogContent = function (props: Props) {

    const initState: State = { id: 'undefined', formData: {}, template: {} as Template }

    const [state, setState] = useState(initState)

    const stepComponents = [
        <TemplateSelection
            parentState={state}
            setParentState={setState} rows={props.rows} />,
        <NewTemplateForm
            parentState={state}
            setParentState={setState}
        />,
        <OBBatchWriter
            parentState={state}
            rows={props.rows}
        /> 
    ]
    const [activeStep, setActiveStep] = React.useState(0);


    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <React.Fragment>
            <DialogTitle>Write new component</DialogTitle>
            <DialogContent>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps: { completed?: boolean } = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length ? (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={props.handle_close()}>Close</Button>
                        </Box>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                        {stepComponents[activeStep]}
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleNext}>
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </Box>
                    </React.Fragment>
                )}
            </DialogContent>
        </React.Fragment>
    )
}

export default WNCStepperDialogContent