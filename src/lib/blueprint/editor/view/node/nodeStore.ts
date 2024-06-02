// import { useState, type Dispatch, type SetStateAction } from 'react'

// const extendedStore:Record<string, Record<string, [boolean, Dispatch<SetStateAction<boolean>>]>> = {}
const extendedStore:Record<string, Record<string, boolean>> = {}

export function initExtended(id:string, index:number, value:boolean) {
  if (extendedStore[id] && extendedStore[id][`${index}`] !== undefined) {
    return
  }
  
  if (!extendedStore[id]) extendedStore[id] = {}
  extendedStore[id][`${index}`] = value
}

export function destroyExtended(id:string) {
  delete extendedStore[id]
}

export function getExtended(id:string, index:number) {
  return extendedStore[id][`${index}`]
}

export function setExtended(id:string, index:number) {
  extendedStore[id][`${index}`] = !extendedStore[id][`${index}`]
}