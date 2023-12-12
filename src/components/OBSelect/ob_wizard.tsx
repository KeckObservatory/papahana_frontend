import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { CommonParameters, Instrument, InstrumentPackage, ObservationBlock, Recipe, Status, Template } from '../../typings/papahana';
import DropDown from '../drop_down';
import { get_select_funcs, ob_api_funcs } from '../../api/ApiRoot';
import { useObserverContext } from '../App';
import { useOBSelectContext } from '../ODT/side_menu';
import { useOBContext } from '../ODT/observation_data_tool_view';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { Instruments } from './select_instrument';

const OBTypes: string[] = ['Science', 'Calibratoin', 'Blank'];

interface Props {
    setOpen: Function
}



const OBRecipeStepper = (props: Props) => {

    const [activeStep, setActiveStep] = React.useState(0);
    // const [inst, setInst] = React.useState('' as Instrument);
    const [inst, setInst] = useQueryParam('instrument', withDefault(StringParam, 'NIRES'))
    const [recipe, setRecipe] = React.useState({} as Recipe);
    const [recipes, setRecipes] = React.useState([] as Recipe[]);
    const [ip, setIP] = React.useState({} as InstrumentPackage)

    const observer_context = useObserverContext()
    const ob_select_context = useOBSelectContext()
    const ob_context = useOBContext()

    React.useEffect(() => {

        const get_recipes = async (instrument: Instrument) => {
            const instPack = await get_select_funcs.get_instrument_package(instrument)
            const instRecipes = await get_select_funcs.get_instrument_recipes(instrument)
            console.log('ip for instrument', inst, instPack)
            console.log('recipes for instrument', instRecipes)
            if (instPack) {
                setRecipes(instRecipes)
                setIP(instPack)
            }
        }
        if (inst) {
            get_recipes(inst as Instrument)
        }
    }, [inst])

    const generate_ob_from_recipe = async () => {
        const templateNames = recipe.recipe
        const ob_data = recipe.ob_data
        let meta = {
            ...ob_data.metadata,
            pi_id: JSON.parse(observer_context.observer_id),
            sem_id: ob_select_context.sem_id,
            priority: 0
        }
        const status = ob_data.status
        const newOB = { ...ob_data, metadata: meta, status: status } as any
        return (newOB as ObservationBlock)
    }

    const set_inst = (newInst: Instrument) => {
        console.log('instrument selected', newInst)
        setInst(newInst)
    }

    const set_type = (newType: string) => {
        console.log('type selected', newType)
        const newRecipe = recipes.find((recipe: Recipe) => recipe.metadata.ui_name === newType)
        setRecipe(newRecipe as Recipe)
    }


    const stepComponents = [
        {
            label: 'Select Instrument',
            component: <DropDown
                placeholder={'instrument'}
                value={inst}
                arr={Instruments}
                handleChange={set_inst}
                label={'Instrument'}
            />
        },
        {
            label: 'Select OB Recipe',
            component: <DropDown
                placeholder={'Recipe'}
                value={recipe?.metadata?.ui_name}
                arr={recipes.map((recipe: Recipe) => recipe.metadata.ui_name)}
                handleChange={set_type}
                label={'OB Recipe'}
            />
        }
    ]

    const handleNext = () => {
        if (inst) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        else {
            console.log('instrument is missing')
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleCreateOB = async () => {
        const newOB = await generate_ob_from_recipe()
        console.log('created new ob', newOB)

        let ob_id: string

        ob_api_funcs.post(newOB)
            .then((obid: string) => {
                ob_id = obid
            })
            .finally(() => {
                setTimeout(() => {
                    console.log(`new ob ${ob_id} added to container. triggering new view`)
                    ob_select_context.setTrigger(ob_select_context.trigger + 1)
                    ob_context.handleOBSelect(ob_id)
                    props.setOpen(false)
                }, 250);
            })
    };

    return (
        <Box sx={{ maxWidth: 400 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {stepComponents.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === 2 ? (
                                    <Typography variant="caption">Last step</Typography>
                                ) : null
                            }
                        >
                            {step.label}
                        </StepLabel>
                        <StepContent>
                            <Box sx={{ mb: 2 }}>
                                <div>
                                    {step.component}
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        {index === stepComponents.length - 1 ? 'Finish' : 'Continue'}
                                    </Button>
                                    <Button
                                        disabled={index === 0}
                                        onClick={handleBack}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === stepComponents.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>All steps completed - OB is ready to be created</Typography>
                    <Button onClick={handleCreateOB} sx={{ mt: 1, mr: 1 }}>
                        Create OB
                    </Button>
                    <Button
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                    >
                        Back
                    </Button>
                </Paper>
            )}
        </Box>
    );
}

interface DialogProps {
    open: boolean
    onClose: Function
    setOpen: Function
}

export const OBWizardDialog = (props: DialogProps) => {

    const { onClose, open, setOpen } = props;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>OB Wizard</DialogTitle>
            <OBRecipeStepper setOpen={setOpen} />
        </Dialog>
    )
}

interface ButtonProps {

}

export const OBWizardButton = (props: ButtonProps) => {

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div>
            <Button sx={{width: "100%"}} variant="contained" onClick={handleClickOpen}>
                New OB From Recipe
            </Button>
            <OBWizardDialog
                open={open}
                setOpen={setOpen}
                onClose={handleClose}
            />
        </div>
    )
}