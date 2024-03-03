import React, { useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import { ObservationBlock } from "../../typings/papahana";
import { ob_api_funcs } from './../../api/ApiRoot';

const DEBOUNCE_SAVE_DELAY = 2000;
const IS_PRODUCTION: boolean = process.env.REACT_APP_ENVIRONMENT === 'production'

interface Props {
    ob: ObservationBlock
}

export const Autosave = (props: Props) => {

    const saveToLocalStorage = (ob: ObservationBlock) => {
        window.localStorage.setItem('OB', JSON.stringify(ob));
    }

    const updateDatabaseOB = (ob: ObservationBlock) => {
        ob_api_funcs.put(ob._id, ob)
    }

    const debouncedSave = useCallback(
        debounce(async (newOB) => {
        if (IS_PRODUCTION) {
            updateDatabaseOB(newOB) //todo: decide to keep this
            await saveToLocalStorage(newOB)
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