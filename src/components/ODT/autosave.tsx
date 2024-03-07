import React, { useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import { ObservationBlock } from "../../typings/papahana";
import { ob_api_funcs } from './../../api/ApiRoot';
import { useOBContext } from "./observation_data_tool_view";
import AJV2019, { ValidateFunction } from 'ajv/dist/2019'
// import AJV, { ValidateFunction } from 'ajv'
import addFormats from "ajv-formats";
import { JSONSchema7 } from 'json-schema'
import { parseOB } from "./sequence_grid/ob_form_beautiful_dnd";

const DEBOUNCE_SAVE_DELAY = 2000;
const IS_PRODUCTION: boolean = process.env.REACT_APP_ENVIRONMENT === 'production'

const OB_SCHEMA_BASE: JSONSchema7 = {
    required: ['metadata', 'status'],
    type: "object",
    properties: {},
    additionalProperties: true
}

export const Autosave = () => {

    const ob_context = useOBContext()
    const ajv = new AJV2019({ allErrors: true, strict: false })
    addFormats(ajv)
    const initValidate = ajv.compile(OB_SCHEMA_BASE)

    const [validate, setValidate] = React.useState<ValidateFunction>(initValidate)
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
        ob_context.obSchema && setValidate((oldValidate: ValidateFunction) => {

            const properties: { [key: string]: JSONSchema7 } = {}
            for (const [name, schemas] of Object.entries(ob_context.obSchema)) {
                console.log('name', name, 'schemas', schemas)
                properties[name] = schemas[0]
            }
            console.log('ob_context.obSchema', ob_context.obSchema, 'properties', properties)
            const newSchema = {
                ...OB_SCHEMA_BASE,
                properties: properties
            }
            console.log('new OB Schema', newSchema)
            try {
                ajv.removeSchema(ob_context.obSchema)
                const newValidate = ajv.compile(newSchema)
                return newValidate
            }
            catch (err) {
                console.error('Error in compiling new schema', err)
                return oldValidate
            }


        })
    }
        , [ob_context.obSchema])

    useEffect(() => {
        console.log('validate', validate);
        if ((validate as unknown as boolean) && ob_context.ob) {
            const parsedOB = parseOB(ob_context.ob)
            validate(parsedOB)
            console.log('errors', validate.errors, 'parsedOB', parsedOB)
            ob_context.setErrors(validate.errors ?? [])
            debouncedSave(ob_context.ob)
        }
    },
        [ob_context.ob, debouncedSave])

    return null
}