import { FormControl } from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import { DefaultTheme, makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: DefaultTheme) => ({
    formControl: {
        minWidth: 120,
        width: '100%',
        margin: theme.spacing(1),
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
        }
    },
}
))

interface MenuProps {
    arr: string[] | undefined
    disabledArr?: boolean[]
    handleChange: Function
    value?: string | null
    placeholder: string
    label: string
}

const MakeMenuItem = (value: string, key: number, disabled = false) => {
    return <MenuItem disabled={disabled} value={value} key={key}>{value}</MenuItem>
}

const DropDown = (props: MenuProps): JSX.Element => {
    const classes = useStyles()
    const value = props.value ? props.value : "" // MenuItem Value cannot be undefined or null

    const menuItems = props.arr?.map((x, idx) => {
        const disabled = props.disabledArr ? props.disabledArr[idx] : false
        return MakeMenuItem(x, idx, disabled)
    })

    const SelectInput = (
        <Select value={value} onChange={(event) => props.handleChange(event.target.value)}>
            <MenuItem disabled value="">
                <em>{props.placeholder}</em>
            </MenuItem>
            {menuItems}
        </Select>
    )

    if (props.value) {
        return (
            <FormControl className={classes.formControl}>
                <InputLabel id="error-select-label">{props.label}</InputLabel>
                {SelectInput}
            </FormControl>
        )
    }
    else {
        return (
            <FormControl error className={classes.formControl}>
                <InputLabel id="select-label">{props.label}</InputLabel>
                {SelectInput}
            </FormControl>
        )
    }
}

export default DropDown