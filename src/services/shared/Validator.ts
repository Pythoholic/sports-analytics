import { SportsEntry } from "../model/Model";

export class MissingFieldError extends Error {
    constructor(missingField: string) {
        super(`Value for ${missingField} expected!`);
    }
}

export function validateAsSportsEntry(arg: any) {
    if ((arg as SportsEntry).match_id == undefined) {
        throw new MissingFieldError('match_id');
    }
    if ((arg as SportsEntry).timestamp == undefined) {
        throw new MissingFieldError('timestamp');
    }
    if ((arg as SportsEntry).team == undefined) {
        throw new MissingFieldError('team');
    }
    if ((arg as SportsEntry).opponent == undefined) {
        throw new MissingFieldError('opponent');
    }
    if ((arg as SportsEntry).event_type == undefined) {
        throw new MissingFieldError('event_type');
    }
    if ((arg as SportsEntry).event_details == undefined) {
        throw new MissingFieldError('event_details');
    }

}
