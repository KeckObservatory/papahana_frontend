import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddContainerDialog from './add_container_dialog';
import RemoveContainerDialog from './remove_container_dialog';
import EditContainerNameDialog from './edit_container_name_dialog';
import { Container, ObservationBlock, Status } from '../../typings/papahana';
import { container_api_funcs, ob_api_funcs } from './../../api/ApiRoot'
import { useOBSelectContext } from './ob_select' 

interface PButtonProps extends Props {
    container_names: Set<string>
    handleClose: Function
}

interface Props {
    id: string,
    type: string
    name?: string
    handleOBSelect: Function
    container_names: Set<string>
    setOB: Function
}

const ex_ob = {
    "acquisition": {
        "metadata": {
            "instrument": "KCWI",
            "name": "KCWI_ifu_acq_direct",
            "script": "KCWI_ifu_acq_direct",
            "sequence_number": 0,
            "type": "acquisition",
            "ui_name": "KCWI direct",
            "version": "0.1.1"
        },
        "parameters": {
            "guider1_coord_dec": "55:22:19.9",
            "guider1_coord_mode": "operator",
            "guider1_coord_ra": "12:44:55.6",
            "rot_cfg_mode": "PA",
            "rot_cfg_wrap": "auto",
            "tcs_coord_decoff": "1",
            "tcs_coord_po": "IFU",
            "tcs_coord_raoff": "0"
        }
    },
    "associations": [
        "xaghm",
        "dycve",
        "cblwm",
        "ojdqc"
    ],
    "common_parameters": {
        "detector_parameters": {
            "det1_mode_amp": 0,
            "det1_mode_binning": "1x1",
            "det1_mode_gain": 2,
            "det1_mode_read": 0,
            "det2_mode_amp": 5,
            "det2_mode_binning": "1x1",
            "det2_mode_gain": 5,
            "det2_mode_read": 1
        },
        "instrument_parameters": {
            "inst_cfg1_filter": "Large",
            "inst_cfg1_grating": "BH3",
            "inst_cfg2_filter": "Medium",
            "inst_cfg2_grating": "RH3",
            "inst_cfg_blockingfilter": "filter1",
            "inst_cfg_calib": "Sky",
            "inst_cfg_hatch": "open",
            "inst_cfg_ifu": "Large",
            "inst_cfg_polarimeter": "Sky",
            "inst_cfg_slicer": "slicer1",
            "inst_kmirror_angle": 122,
            "inst_kmirror_mode": "Tracking",
            "inst_ns_direction": 1,
            "inst_ns_mask": "open",
            "inst_wavelength1_central": 450,
            "inst_wavelength1_peak": 470,
            "inst_wavelength2_central": 789,
            "inst_wavelength2_peak": 800
        },
        "metadata": {
            "instrument": "KCWI",
            "name": "kcwi_common_parameters",
            "template_type": "common_parameters",
            "ui_name": "KCWI Common parameters",
            "version": "0.1.1"
        },
        "tcs_parameters": {}
    },
    "metadata": {
        "instrument": "KCWI",
        "name": "standard stars #1",
        "ob_type": "science",
        "pi_id": 9998,
        "priority": 100,
        "sem_id": "2018A_U045",
        "version": "0.1.0"
    },
    "observations": [
        {
            "metadata": {
                "instrument": "KCWI",
                "name": "KCWI_ifu_sci_dither",
                "script": "KCWI_ifu_sci_stare",
                "sequence_number": 1,
                "template_type": "science",
                "ui_name": "KCWI dither",
                "version": 0.1
            },
            "parameters": {
                "det1_exp_number": 2,
                "det1_exp_time": 60.0,
                "det2_exp_number": 4,
                "det2_exptime": 121.0,
                "seq_dither_number": 4,
                "seq_dither_pattern": [
                    {
                        "seq_dither_dec_offset": 0,
                        "seq_dither_guided": true,
                        "seq_dither_position": "T",
                        "seq_dither_ra_offset": 0
                    },
                    {
                        "seq_dither_dec_offset": 5,
                        "seq_dither_guided": false,
                        "seq_dither_position": "S",
                        "seq_dither_ra_offset": 5
                    },
                    {
                        "seq_dither_dec_offset": 0,
                        "seq_dither_guided": true,
                        "seq_dither_position": "T",
                        "seq_dither_ra_offset": 0
                    },
                    {
                        "seq_dither_dec_offset": 5,
                        "seq_dither_guided": false,
                        "seq_dither_position": "S",
                        "seq_dither_ra_offset": 5
                    }
                ]
            }
        },
        {
            "metadata": {
                "instrument": "KCWI",
                "name": "KCWI_ifu_sci_stare",
                "script": "KCWI_ifu_sci_stare",
                "sequence_number": 2,
                "template_type": "science",
                "ui_name": "KCWI stare",
                "version": "0.1.0"
            },
            "parameters": {
                "det1_exp_number": 4,
                "det1_exp_time": 30,
                "det2_exp_number": 6,
                "det2_exp_time": 24
            }
        },
        {
            "metadata": {
                "instrument": "KCWI",
                "name": "KCWI_ifu_sci_stare",
                "script": "KCWI_ifu_sci_stare",
                "sequence_number": 3,
                "template_type": "science",
                "ui_name": "KCWI stare",
                "version": "0.1.0"
            },
            "parameters": {
                "det1_exp_number": 4,
                "det1_exp_time": 30,
                "det2_exp_number": 6,
                "det2_exp_time": 24
            }
        },
        {
            "metadata": {
                "instrument": "KCWI",
                "name": "KCWI_ifu_sci_dither",
                "script": "KCWI_ifu_sci_stare",
                "sequence_number": 4,
                "template_type": "science",
                "ui_name": "KCWI dither",
                "version": 0.1
            },
            "parameters": {
                "det1_exp_number": 2,
                "det1_exp_time": 60.0,
                "det2_exp_number": 4,
                "det2_exptime": 121.0,
                "seq_dither_number": 4,
                "seq_dither_pattern": [
                    {
                        "seq_dither_dec_offset": 0,
                        "seq_dither_guided": true,
                        "seq_dither_position": "T",
                        "seq_dither_ra_offset": 0
                    },
                    {
                        "seq_dither_dec_offset": 5,
                        "seq_dither_guided": false,
                        "seq_dither_position": "S",
                        "seq_dither_ra_offset": 5
                    },
                    {
                        "seq_dither_dec_offset": 0,
                        "seq_dither_guided": true,
                        "seq_dither_position": "T",
                        "seq_dither_ra_offset": 0
                    },
                    {
                        "seq_dither_dec_offset": 5,
                        "seq_dither_guided": false,
                        "seq_dither_position": "S",
                        "seq_dither_ra_offset": 5
                    }
                ]
            }
        },
        {
            "metadata": {
                "instrument": "KCWI",
                "name": "KCWI_ifu_sci_dither",
                "script": "KCWI_ifu_sci_stare",
                "sequence_number": 5,
                "template_type": "science",
                "ui_name": "KCWI dither",
                "version": 0.1
            },
            "parameters": {
                "det1_exp_number": 2,
                "det1_exp_time": 60.0,
                "det2_exp_number": 4,
                "det2_exptime": 121.0,
                "seq_dither_number": 4,
                "seq_dither_pattern": [
                    {
                        "seq_dither_dec_offset": 0,
                        "seq_dither_guided": true,
                        "seq_dither_position": "T",
                        "seq_dither_ra_offset": 0
                    },
                    {
                        "seq_dither_dec_offset": 5,
                        "seq_dither_guided": false,
                        "seq_dither_position": "S",
                        "seq_dither_ra_offset": 5
                    },
                    {
                        "seq_dither_dec_offset": 0,
                        "seq_dither_guided": true,
                        "seq_dither_position": "T",
                        "seq_dither_ra_offset": 0
                    },
                    {
                        "seq_dither_dec_offset": 5,
                        "seq_dither_guided": false,
                        "seq_dither_position": "S",
                        "seq_dither_ra_offset": 5
                    }
                ]
            }
        }
    ],
    "status": {
        "current_exp": 0,
        "current_seq": 2,
        "current_step": 3,
        "deleted": false,
        "executions": [],
        "priority": 73,
        "state": 4
    },
    "target": {
        "metadata": {
            "name": "multi_object_target",
            "template_type": "target",
            "ui_name": "Multi-Object Spectroscopy Target",
            "version": "0.1.1"
        },
        "parameters": {
            "rot_cfg_pa": 9.649406190373742,
            "seq_constraint_obstime": "2021-04-22 15:08:04",
            "target_coord_dec": "35:11:36",
            "target_coord_epoch": "2000",
            "target_coord_frame": "FK5",
            "target_coord_pm_dec": 8.377213209458013,
            "target_coord_pm_ra": 4.646989730848324,
            "target_coord_ra": "21:03:44",
            "target_info_comment": "Observe at midnight",
            "target_info_magnitude": {
                "target_info_band": "K",
                "target_info_mag": 1.9566794662679863
            },
            "target_info_name": "nrjp"
        }
    }
}

const PopoverButtons = (props: PButtonProps) => {

    const ob_select_context = useOBSelectContext() 

    const addOB = () => {
        console.log(`creating new ob in ${props.type} id ${props.id}.`)
        const meta = {
            name: "Made by ODT",
            priority: 0,
            version: "0.1.0",
            ob_type: "engineering",
            instrument: "KCWI",
            pi_id: 2003,
            sem_id: "2017A_U050",
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
        //@ts-ignore
        const _id = JSON.stringify(Date.now()) + 'XXXXXXXXXXX' // _id is not used. this is to get past validation.
        const newOB = { _id: _id, metadata: meta, status: status } as ObservationBlock
        // props.setOB(newOB)
        let ob_id: string;
        ob_api_funcs.post(ex_ob)
        .then((obid: string) => {
            ob_id = obid 
            return container_api_funcs.get(props.id)
        })
        .then((container: Container) => {
            container.observation_blocks.push(ob_id)
            //update container and update 
            return container_api_funcs.put(container._id, container)
        })
        .finally(()=>{
            setTimeout(() => {
                console.log("new ob added to container. triggering new view")
                ob_select_context.setTrigger(ob_select_context.trigger + 1)
                props.handleClose()
            }, 1000);
        })
    }

    const removeOB = () => {
        console.log(`removing ${props.type} id ${props.id}.`)
    }

    const selectOB = () => {
        console.log(`selecting ${props.type} id ${props.id}.`)
        props.handleOBSelect(props.id)
        props.handleClose()
    }

    return (
        <div style={{ display: 'grid' }}>
            {props.type === 'semid' &&
                <div style={{ display: 'grid' }}>
                    <AddContainerDialog
                        container_names={props.container_names}
                        handleClose={props.handleClose}
                    />
                </div>
            }
            {props.type === 'container' &&
                <div style={{ display: 'flex' }}>
                    <Button onClick={addOB}>add new OB</Button>
                    <RemoveContainerDialog
                        name={props.name as string}
                        container_id={props.id}
                        handleClose={props.handleClose}
                    />
                    <EditContainerNameDialog
                        container_names={props.container_names}
                        name={props.name as string}
                        container_id={props.id}
                        handleClose={props.handleClose}
                    />
                </div>
            }
            {props.type === 'ob' &&
                <div style={{ display: 'grid' }}>
                    <Button onClick={selectOB}>edit ob</Button>
                    {/* <Button onClick={removeOB}>delete ob</Button> */}
                </div>
            }
        </div>
    )
}

const NodePopover = (props: Props) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div style={{ marginLeft: 'auto' }}>
            <IconButton onClick={handleClick} aria-label="more">
                <MoreVertIcon />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2 }}>The content of the {props.type} id {props.id}.</Typography>
                <PopoverButtons
                    container_names={props.container_names}
                    handleOBSelect={props.handleOBSelect}
                    handleClose={handleClose}
                    type={props.type}
                    setOB={props.setOB}
                    id={props.id} />
            </Popover>
        </div>
    );
}

export default NodePopover 