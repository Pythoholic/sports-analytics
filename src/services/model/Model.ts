export interface PlayerDetails {
    name?: string;
    position?: string;
    number?: number;
}

export interface EventDetails {
    player?: PlayerDetails;
    goal_type?: string;
    minute?: number;
    assist?: PlayerDetails | null;
    video_url?: string;
}

export interface SportsEntry {
    match_id: string;
    timestamp: string;
    team: string;
    opponent: string;
    event_type: string;
    event_details: EventDetails;
}




