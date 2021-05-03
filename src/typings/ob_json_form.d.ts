
export interface Items {
  type: string
}

export interface OBJSProperty {
  type: string
  title: string
  readonly?: boolean
  comment?: string
  uniqueItems?: boolean
  items?: Items
}

export interface OBJsonSchemaProperties {
  [key: string]: OBJSProperty
}

export interface OBJsonSchema {
  title: string
  type: string
  required: string[]
  properties: OBJsonSchemaProperties
}