import React from 'react'
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { animated } from 'react-spring';
import Tooltip from '@mui/material/Tooltip';
import useBoop from '../../hooks/boop';

interface Props {
    validatorReport: { [key: string]: string }
}

const OBValidator = (props: Props) => {
    let isError = Object.keys(props.validatorReport).length > 0

    const color = isError ? 'red': 'green'
    const [boopStyle, triggerBoop] = useBoop({})
    React.useEffect( () => {
        triggerBoop(isError)
        console.log('boop style', boopStyle)
    }, [isError])


    const handleOpen = () => {
        triggerBoop(false)
    }

    return (
        <Tooltip title="View OB Validation Report">
            <animated.button aria-label='upload' onClick={handleOpen} style={{ color: color, ...boopStyle }}>
                { isError ? <ErrorIcon />:<CheckCircleIcon /> }
            </animated.button>
        </Tooltip>
    )

}

export default OBValidator