import React, { useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import { ObservationBlock } from "../../typings/papahana";

const DEBOUNCE_SAVE_DELAY = 1000;

interface Props {
    ob: ObservationBlock
}

export const Autosave = (props: Props) => {


    const saveToLocalStorage = (ob: ObservationBlock) => {
        //ob
        window.localStorage.setItem('OB', JSON.stringify(ob));
        console.log('save ob to local storage', ob)
    }

    const debouncedSave = useCallback(debounce(async (newOB) => {
        await saveToLocalStorage(newOB) }, DEBOUNCE_SAVE_DELAY),
        []
    )

    useEffect(() => {
        if(props.ob) {
            debouncedSave(props.ob)
        }
    }, [props.ob, debouncedSave])

    return null
}