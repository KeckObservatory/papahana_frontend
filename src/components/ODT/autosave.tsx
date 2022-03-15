import React, { useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import { ObservationBlock } from "../../typings/papahana";
import { api_funcs } from './../../api/ApiRoot';

const DEBOUNCE_SAVE_DELAY = 1000;
const IS_PRODUCTION: boolean = process.env.REACT_APP_ENVIRONMENT === 'production'

interface Props {
    ob: ObservationBlock
}

export const Autosave = (props: Props) => {

    const saveToLocalStorage = (ob: ObservationBlock) => {
        window.localStorage.setItem('OB', JSON.stringify(ob));
    }

    const updateDatabaseOB = (ob: ObservationBlock) => {
        api_funcs.put(ob._id, ob)
    }

    const debouncedSave = useCallback(
        debounce(async (newOB) => {
        if (IS_PRODUCTION) {
            updateDatabaseOB(newOB)
        }
        else {
            await saveToLocalStorage(newOB)
        }
    }, DEBOUNCE_SAVE_DELAY),
        []
    )

    useEffect(() => {
        if (props.ob) {
            debouncedSave(props.ob)
        }
    }, [props.ob, debouncedSave])

    return null
}