
export interface Items {
  type: string | array | object
}

export interface JSProperty {
  type: string
  title: string
  readonly?: boolean
  comment?: string
  required?: array
  uniqueItems?: boolean
  enum?: array
  items?: Items | JsonSchema
  properties?: OBJsonSchemaProperties
}

export interface OBJsonSchemaProperties {
  [key: string]: OBJSProperty
}

export interface JsonSchema {
  title?: string
  type: string
  required?: string[]
  items?: object,
  properties?: OBJsonSchemaProperties 
}

