import React from 'react';
import { tag_functions } from './../../api/ApiRoot'
import Chip from '@mui/material/Chip';


interface Props {
    tags: string[],
    tableMeta: any
}

const TagEditor = (props: Props) => {
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
        setTags((oldTags) => {
            const newTags = [...oldTags]
            newTags.splice(idx, 1)
            return newTags 
        })
    }

    return (
        <React.Fragment></React.Fragment>
    )
}

export default TagEditor