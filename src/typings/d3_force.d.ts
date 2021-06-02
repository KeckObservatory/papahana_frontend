import {Dispatch, SetStateAction} from 'react'

export namespace D3Types {
    export type Node = {
      name: string
      id?: string
      group: string 
      radiusSize: number
      fillColor: string
    }
    export type Link = {
      source: string
      target: string
      value: string
    }
    export type DataObject = {
      nodes: Node[]
      links: Link[]
    }
    export type Point = {
      x: number
      y: number
    }
    export type Datum = {
      x: number
      y: number
      fx: number | null
      fy: number | null
    }

  }
  
export type DispatchIdx = Dispatch<SetStateAction<number | number[]>>