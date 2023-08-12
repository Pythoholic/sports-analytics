import { SportsEntry } from "../model/Model"



export class MissingFieldError extends Error{
    constructor(missingField: string){
        super (`Value for ${missingField} expected!`)
    }
}

export function validateAsSportsEntry(arg: any){
    if ((arg as SportsEntry).location == undefined){
        throw new MissingFieldError('location')
    }
    if ((arg as SportsEntry).name == undefined){
        throw new MissingFieldError('name')
    }
    if ((arg as SportsEntry).id == undefined){
        throw new MissingFieldError('id')
    }
}