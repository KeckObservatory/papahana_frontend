import { FormControl } from '@material-ui/core'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import { Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles( (theme: Theme) => ({
    formControl: {
        minWidth: 120,
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
    arr: string[]
    disabledArr?: boolean[]
    handleChange: Function 
    value?: string | null | undefined
    placeholder: string
    label: string
}

const MakeMenuItem = (value: string, key: number, disabled=false) => {
    return <MenuItem disabled={disabled} value={value} key={key}>{value}</MenuItem>
}

const DropDown = (props: MenuProps): JSX.Element => { 
    const classes = useStyles()
    const value = props.value ? props.value : "" // MenuItem Value cannot be undefined or null
    return(
    <FormControl className={classes.formControl}>
    <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
    <Select value={value} onChange={(event) => props.handleChange(event.target.value)}>
        <MenuItem disabled value="">
            <em>{props.placeholder}</em>
        </MenuItem>
        {props.arr.map((x,idx) =>  { 
            const disabled = props.disabledArr? props.disabledArr[idx] : false 
            return MakeMenuItem(x, idx, disabled) 
        })}
    </Select>
    </FormControl>
    )}

export default DropDown