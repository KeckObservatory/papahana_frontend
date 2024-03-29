import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddContainerDialog from './add_container_dialog';
import RemoveContainerDialog from './remove_container_dialog';
import EditContainerNameDialog from './edit_container_name_dialog';
import { Container, Instrument, ObservationBlock, Status } from '../../typings/papahana';
import { container_api_funcs, ob_api_funcs } from './../../api/ApiRoot'
import { useOBSelectContext } from './../ODT/side_menu'
import { useObserverContext } from './../App'
import SelectInstrument from './select_instrument'
import { OBWizardButton } from './ob_wizard';
import { useOBContext } from '../ODT/observation_data_tool_view';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

interface PButtonProps extends Props {
    handleClose: Function
}

interface Props {
    id: string,
    type: string
    name?: string
    parentNodeId?: string
    ob_details?: Partial<ObservationBlock>
    container_names?: Set<string>
    open?: boolean,
    handleClose?: Function
    anchorPos?: object 
    pid?: string
}

const PopoverButtons = (props: PButtonProps) => {

    const ob_select_context = useOBSelectContext()
    const observer_context = useObserverContext()

    const [instrument, setInstrument] = useQueryParam('instrument', withDefault(StringParam, 'KCWI'))
    const ob_context = useOBContext()

    const addOB = (inst: string) => {
        console.log(`creating new ${inst} ob in ${props.type} id ${props.id}.`)
        const meta = {
            name: `Made by ODT for ${inst}`,
            priority: 0,
            version: "0.1.0",
            ob_type: "engineering",
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
        const newOB = { metadata: meta, status: status } as ObservationBlock
        let ob_id: string;
        if (props.id !== 'All OBs') { //post ob and update container
            ob_api_funcs.post(newOB)
                .then((obid: string) => {
                    ob_id = obid
                    return container_api_funcs.get(props.id)
                })
                .then((container: Container) => {
                    container.observation_blocks.push(ob_id)
                    //update container and update 
                    return container_api_funcs.put(container._id, container)
                })
                .finally(() => {
                    setTimeout(() => {
                        console.log(`new ob ${ob_id} added to container. triggering new view`)
                        ob_select_context.setTrigger(ob_select_context.trigger + 1)
                        ob_context.handleOBSelect(ob_id)
                        props.handleClose()
                    }, 250);
                })
        }
        else { //ignore containers
            ob_api_funcs.post(newOB)
                .then( (obid: string) => {
                    ob_id = obid
                })
                .finally(() => {
                    setTimeout(() => {
                        console.log(`new ob ${ob_id} added to container. triggering new view`)
                        setInstrument(newOB.metadata.instrument as Instrument)
                        ob_select_context.setTrigger(ob_select_context.trigger + 1)
                        ob_context.handleOBSelect(ob_id)
                        props.handleClose()
                    }, 250);
                })
        }
    }

    const removeOBFromContainer = () => {
        const container_id = props.parentNodeId ? props.parentNodeId : ''
        console.log(`removing ${props.type} id ${props.id} from container ${container_id}`)
        container_api_funcs.get(container_id)
            .then((container: Container) => {
                let newCont = {...container}
                const new_obs = container.observation_blocks.filter( x => x !== props.id)
                newCont['observation_blocks'] = new_obs
                return container_api_funcs.put(container._id, newCont)
            })
            .finally(() => {
                setTimeout(() => {
                    console.log("removed ob from container. triggering new view")
                    ob_select_context.setTrigger(ob_select_context.trigger + 1)
                    props.handleClose()
                }, 1000);
            })
    }

    const selectOB = () => {
        console.log(`selecting ${props.type} id ${props.id}.`)
        ob_context.handleOBSelect(props.id)
        props.handleClose()
    }


    return (
        <div style={{ display: 'grid' }}>
            {props.type === 'semid' &&
                <div style={{ display: 'grid' }}>
                    <AddContainerDialog
                        container_names={props.container_names as Set<string>}
                        handleClose={props.handleClose}
                    />
                </div>
            }
            {props.type === 'container' &&
                <div style={{ display: 'flex' }}>
                    <SelectInstrument addOB={addOB}/>
                    <OBWizardButton />
                    <RemoveContainerDialog
                        name={props.name as string}
                        container_id={props.id}
                        handleClose={props.handleClose}
                    />
                    <EditContainerNameDialog
                        container_names={props.container_names as Set<string>}
                        name={props.name as string}
                        container_id={props.id}
                        handleClose={props.handleClose}
                    />
                </div>
            }
            {props.type === 'ob' &&
                <div style={{ display: 'grid' }}>
                    <Button onClick={selectOB}>edit ob</Button>
                    <Button onClick={removeOBFromContainer}>remove ob from container</Button>
                </div>
            }
        </div>
    )
}

const create_ob_text = (ob_details: Partial<ObservationBlock>) => {
    const ra = ob_details?.target?.parameters.target_coord_ra
    const dec = ob_details?.target?.parameters.target_coord_dec
    const name = ob_details?.metadata?.name
    const comment = ob_details?.metadata?.comment
    const obType = ob_details?.metadata?.ob_type
    return (
        <React.Fragment>
            <Typography sx={{ paddingLeft: 2 }}>OB Type: {obType}</Typography>
            {ob_details.target && 
            <Typography sx={{ paddingLeft: 2 }}>Ra: {ra}</Typography>
            }
            {ob_details.target && 
            <Typography sx={{ paddingLeft: 2 }}>Dec: {dec}</Typography>
            }
            {ob_details.metadata?.comment && 
            <Typography sx={{ paddingLeft: 2 }}>comment: {comment}</Typography>
            }
        </React.Fragment>
    )
}

const NodePopover = (props: Props) => {

    const text = `${props.type[0].toUpperCase() + props.type.slice(1)} Name: ${props.name}.`
    return (
        <div style={{ marginLeft: 'auto' }}>
            <Popover
                id={props.pid}
                open={props.open as boolean}
                anchorReference="anchorPosition"
                anchorPosition={props.anchorPos as any}
                onClose={props.handleClose as any}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2 }}>{text}</Typography>
                {props.ob_details && create_ob_text(props.ob_details)}
                <PopoverButtons
                    container_names={props.container_names}
                    parentNodeId={props.parentNodeId}
                    handleClose={props.handleClose as Function}
                    type={props.type}
                    name={props.name}
                    id={props.id} />
            </Popover>
        </div>
    );
}

export default NodePopover 