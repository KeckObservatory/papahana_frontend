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

    const [boopStyle, triggerBoop] = useBoop({})
    triggerBoop(isError)


    const handleOpen = () => {

    }

    return (
        <Tooltip title="Upload OB to database">
            <animated.button aria-label='upload' onClick={handleOpen} style={boopStyle}>
                { isError ? <ErrorIcon />:<CheckCircleIcon /> }
            </animated.button>
        </Tooltip>
    )

}

export default OBValidator