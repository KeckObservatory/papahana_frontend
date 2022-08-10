import React from 'react';
import ChipInput from 'material-ui-chip-input'
import { tag_functions } from './../../api/ApiRoot'


interface Props {
    tags: string[],
    tableMeta: any
}

const TagEditor = (props: Props) => {
    console.log('TagEditor Inputs', props.tags, props.tableMeta)
    const ob_id = props.tableMeta.rowData[0]
    const [tags, setTags] = React.useState(props.tags)

    const handleAddChip = (chip: string) => {
        console.log('chip created', chip, props)
        tag_functions.add_tag(ob_id, chip)
        setTags((oldTags) => [...oldTags, chip])

    }

    const handleDeleteChip = (chip: any, idx: number) => {
        console.log('deleting chip', chip, idx)
        tag_functions.delete_tag(ob_id, chip)
        setTags((oldTags) => oldTags.splice(idx, 1))
    }


    return (
        <ChipInput 
        value={props.tags}
        onAdd={(chip) => handleAddChip(chip)}
        onDelete={(chip, index) => handleDeleteChip(chip, index)}
        />

    )
}

export default TagEditor