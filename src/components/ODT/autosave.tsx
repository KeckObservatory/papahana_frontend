import React, { useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import { ObservationBlock } from "../../typings/papahana";
import { ob_api_funcs } from './../../api/ApiRoot';
import { useOBContext } from "./observation_data_tool_view";
import AJV2019, { ValidateFunction } from 'ajv/dist/2019'

const DEBOUNCE_SAVE_DELAY = 2000;
const IS_PRODUCTION: boolean = process.env.REACT_APP_ENVIRONMENT === 'production'
import { JSONSchema7 } from 'json-schema'

const OB_SCHEMA_BASE: JSONSchema7 = {
    required: ['_id', 'metadata'],
    type: "object",
    properties: {},
    additionalProperties: true
}

export const Autosave = () => {

    const obContext = useOBContext()
    const ajv = new AJV2019({ allErrors: true })

    const [validate, setValidate] = React.useState<ValidateFunction>(ajv.compile(OB_SCHEMA_BASE))
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
        obContext.obSchema && ajv.compile({
            ...OB_SCHEMA_BASE,
            properties: { ...obContext.obSchema }
        }
        )
        setValidate(ajv.compile(obContext.obSchema))
    }, [obContext.obSchema])

    useEffect(() => {
        const errors = validate(obContext.ob)
        errors && obContext.setErrors(errors)
        debouncedSave(obContext.ob)
    },
    [obContext.ob, debouncedSave])
    return null
}