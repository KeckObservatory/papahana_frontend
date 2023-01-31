import React from 'react'
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { animated } from 'react-spring';
import Tooltip from '@mui/material/Tooltip';
import useBoop from '../../hooks/boop';
import { ValidatorReport } from '../../typings/papahana';

interface Props {
    validatorReport: ValidatorReport 
}

const OBValidator = (props: Props) => {
    
    let msg = !props.validatorReport.valid? 'OB is partially defined' : 'OB is fully defined'

    const color = !props.validatorReport.valid ? 'red': 'green'
    const [boopStyle, triggerBoop] = useBoop({})
    React.useEffect( () => {
        triggerBoop(!props.validatorReport.valid)
        console.log('boop style', boopStyle)
    }, [props.validatorReport])


    const handleOpen = () => {
        triggerBoop(false)
    }

    return (
        <Tooltip title={`View OB Validation Report. ${msg}`}>
            <animated.button aria-label='upload' onClick={handleOpen} style={{ color: color, ...boopStyle }}>
                { props.validatorReport ? <CheckCircleIcon /> : <ErrorIcon />}
            </animated.button>
        </Tooltip>
    )

}

export default OBValidator