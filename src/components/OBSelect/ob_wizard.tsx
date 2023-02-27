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
import { CommonParameters, Instrument, InstrumentPackage, OBComponent, ObservationBlock, Recipe, Status, Template } from '../../typings/papahana';
import DropDown from '../drop_down';
import { get_select_funcs, ob_api_funcs } from '../../api/ApiRoot';
import { useObserverContext } from '../App';
import { useOBSelectContext } from '../ODT/side_menu';
import { useOBContext } from '../ODT/observation_data_tool_view';
import { resolve } from 'path';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

const Instruments: Instrument[] = ['KCWI', 'KPF', 'SSC'];
const OBTypes: string[] = ['Science', 'Calibratoin', 'Blank'];

interface Props {
    setOpen: Function
}



const OBRecipeStepper = (props: Props) => {

    const [activeStep, setActiveStep] = React.useState(0);
    // const [inst, setInst] = React.useState('' as Instrument);
    const [inst, setInst] = useQueryParam('instrument', withDefault(StringParam, 'KCWI'))
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
        const meta = {
            name: `Made by ODT for ${inst} using ${recipe.metadata.ui_name} recipe`,
            priority: 0,
            version: "0.1.0",
            ob_type: recipe.metadata.ob_type,
            instrument: inst,
            pi_id: JSON.parse(observer_context.observer_id),
            sem_id: ob_select_context.sem_id,
            comment: ""
        }
        const status: Status = {
            current_exp_det1: 0,
            current_exp_det2: 0,
            current_seq: 0,
            current_step: 0,
            deleted: false,
            executions: [],
            priority: 0,
            state: 4
        }
        const newOB = { metadata: meta, status: status } as any
        for (let idx = 0; idx<templateNames.length; idx++) {
            const tName = templateNames[idx]
            const templateObj = await get_select_funcs.get_template(tName, inst)
            const [key, template] = Object.entries(templateObj)[0]
            let comp = {
                'metadata': template.metadata,
            } as any
            if (tName.includes('common')) {
                comp = comp as CommonParameters
                comp['detector_parameters'] = {}
                comp['instrument_parameters'] = {}
                comp['tcs_parameters'] = {}
            }
            else {
                let params = {}
                const paramsKeys = Object.keys(template.parameters)
                for (let jdx = 0; jdx<paramsKeys.length; jdx++){
                    const key = paramsKeys[jdx] 
                    const param= template.parameters[key]
                    //@ts-ignore
                    params[key] = param.default && param.default 
                }
                comp['parameters'] = params 
            }
            const tType = template.metadata.template_type
            if (tType.includes('science') || tType.includes('calibration')) {
                newOB['observations'] = [comp]
            }
            else {
                newOB[template.metadata.template_type] = comp
            }
        }
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
            <Button variant="outlined" onClick={handleClickOpen}>
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