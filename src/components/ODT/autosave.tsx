import React, { useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import { Metadata, OBMetadata, ObservationBlock } from "../../typings/papahana";
import { ob_api_funcs } from './../../api/ApiRoot';
import { TemplateSchemas, get_ob_schemas, useOBContext } from "./observation_data_tool_view";
import AJV2019, { ValidateFunction } from 'ajv/dist/2019'
// import AJV, { ValidateFunction } from 'ajv'
import addFormats from "ajv-formats";
import { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import { parseOB } from "./sequence_grid/ob_form_beautiful_dnd";

const DEBOUNCE_SAVE_DELAY = 2000;
const IS_PRODUCTION: boolean = process.env.REACT_APP_ENVIRONMENT === 'production'

const OB_SCHEMA_BASE: JSONSchema7 = {
    title: "Observation Block",
    required: ['metadata', 'status'],
    type: "object",
    properties: {},
    additionalProperties: true
}

export const Autosave = () => {

    const ob_context = useOBContext()
    const ajv = new AJV2019({ allErrors: true, strict: false })
    addFormats(ajv)
    const saveToLocalStorage = (ob: ObservationBlock) => {
        window.localStorage.setItem('OB', JSON.stringify(ob));
    }

    const [obSchema, setOBSchema] = React.useState<JSONSchema7>(OB_SCHEMA_BASE)

    const updateDatabaseOB = (ob: ObservationBlock) => {
        ob_api_funcs.put(ob._id, ob)
    }

    const debouncedSave = useCallback(
        debounce(async (newOB) => {
            try {
                const val = validate && await validate(newOB)
                console.log('errors', val?.errors, 'ob', ob_context.ob)
                ob_context.setErrors(val?.errors ?? [])
            }
            catch (err) {
                console.error('error validating ob', err)
            }
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

    const create_ob_schema = (obMetadata: OBMetadata, templateSchemas: TemplateSchemas) => {
        const properties: { [key: string]: JSONSchema7 } = {}
        for (let idx = 0; idx < Object.keys(templateSchemas).length; idx++) {
            const key = Object.keys(templateSchemas)[idx]
            const schema = templateSchemas[key][0].properties as { [key: string]: JSONSchema7Definition }
            console.log('key', key, 'schema', schema)
            properties[key] = {
                title: key,
                type: 'object',
                properties: {
                    metadata: {
                        title: 'metadata',
                        type: 'object'
                    },
                    parameters: {
                        title: 'parameters',
                        type: 'object',
                        properties: schema
                    },
                }
            }
        }

        const newSchema = {
            ...OB_SCHEMA_BASE,
            properties: properties,
            required: obMetadata?.ob_type?.includes("Science") ?
                ['metadata', 'status', 'acquisition', 'target'] : OB_SCHEMA_BASE.required
        }
        console.log('ob_context.templateSchemas', templateSchemas, 'newSchema', newSchema)
        return newSchema

    }

    const validate = useCallback( async (ob: ObservationBlock) => {

        let difference = Object.keys(parseOB(ob)).filter(x => !Object.keys(ob_context.templateSchemas).includes(x));
        let templateSchemas = ob_context.templateSchemas 
        if (difference.length > 0) {
            console.log('difference in ob and templateSchemas, updateing templateSchemas', difference)
            templateSchemas = await get_ob_schemas(ob)
            ob_context.setTemplateSchemas(templateSchemas)
            const newOBSchema = create_ob_schema(ob.metadata, templateSchemas)
            setOBSchema(newOBSchema)
        }

        const parsedOB = parseOB(ob)
        try {
            const newValidate = ajv.compile(obSchema)
            newValidate(parsedOB)
            console.log('errors', newValidate.errors, 'parsedOB', parsedOB)
            ob_context.setErrors(newValidate.errors ?? [])
            return newValidate
        }
        catch (err) {
            console.error('error compiling schema', err, 'obSchema', obSchema, 'ob', ob, 'parsedOB', parsedOB)
        }
    }, [ob_context.templateSchemas, obSchema])

    useEffect(() => {
        ob_context.ob !== undefined && debouncedSave(ob_context.ob)
    },
        [ob_context.ob, debouncedSave])

    return null
}