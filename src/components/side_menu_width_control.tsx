import React from 'react'
import { useDrawerOpenContext } from './App'
import { Tooltip } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import ChevronRight from '@mui/icons-material/ChevronRight'
import ChevronLeft from '@mui/icons-material/ChevronLeft'

interface Props {

}

const SideMenuWidthControl = (props: Props) => {

    const drawer = useDrawerOpenContext()
    const inc = 30

    const handleLeftClick = () => {
        if(drawer.drawerWidth>inc) drawer.setDrawerWidth((currWidth: number) => currWidth - 30)
    }

    const handleRightClick = () => {
        drawer.setDrawerWidth((currWidth: number) => currWidth + 30)
    }


    return (
        <React.Fragment>
            <Tooltip title="Reduce side menu">
                <IconButton
                    // color="inherit"
                    aria-label="reduce width"
                    onClick={handleLeftClick}
                >
                    <ChevronLeft />
                </IconButton>
            </Tooltip>
            <Tooltip title="Enlarge side menu">
                <IconButton
                    // color="inherit"
                    aria-label="enlarge width"
                    onClick={handleRightClick}
                >
                    <ChevronRight />
                </IconButton>
            </Tooltip>
        </React.Fragment>
    )
}

export default SideMenuWidthControl 