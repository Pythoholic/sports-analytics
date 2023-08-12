import { handler } from "../src/services/hello";
import { handler as ingesthandler } from "../src/services/ingest/handler";

process.env.AWS_REGION = 'ap-south-1';
process.env.TABLE_NAME = 'SportTable-02dff94f18a2';

ingesthandler ({
    httpMethod: 'POST',
    body: JSON.stringify({
        "match_id": "67890",
        "timestamp": "2023-08-11T20:30:00Z",
        "team": "Manchester United",
        "opponent": "Chelsea",
        "event_type": "goal",
        "event_details": {
            "player": {
                "name": "Cristiano Ronaldo",
                "position": "Forward",
                "number": 7
            },
            "goal_type": "free-kick",
            "minute": 55,
            "assist": {
                "name": "Bruno Fernandes",
                "position": "Midfielder",
                "number": 18
            },
            "video_url": "https://example.com/free_kick_goal_video.mp4"
        }
    })
} as any, {} as any);