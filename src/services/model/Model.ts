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

export interface TeamStatistics {
    team: string;
    total_matches: number;
    total_wins: number;
    total_draws: number;
    total_losses: number;
    total_goals_scored: number;
    total_fouls: number;
    total_goals_conceded: number;
}


