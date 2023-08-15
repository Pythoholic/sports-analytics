import { DynamoDBClient, GetItemCommand, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";

/*
This API Call should process the data in the SportsTable 
and get the response like this:
ball possesssion can be calculated if the event gives ball passing events
{
    "status": "success",
    "match_id": "12345",
    "statistics": {
        "team": "FC Barcelona",
        "opponent": "Real Madrid",
        "total_goals": 3,
        "total_fouls": 2,
        "ball_possession_percentage": 58
    }
}
*/

export async function getMatchStatistics(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if (event.pathParameters && 'match_id' in event.pathParameters) {
        const matchId = event.pathParameters?.match_id;

        console.log("Received match ID:", matchId);
        const getItemsMatchResponse = await ddbClient.send(new ScanCommand({
            TableName: process.env.TABLE_NAME,
            FilterExpression: "match_id = :matchId",
            ExpressionAttributeValues: {
                ":matchId": { S: matchId }
            }
        }));

        // lets add a counter so that we can get data in the for loop.
        let stats_counter = {
            total_goals: 0,
            total_fouls: 0,
            total_passing_count: 0,
            total_team_passing: 0,
        }

        if (getItemsMatchResponse.Items && getItemsMatchResponse.Items.length > 0) {
            const unmarshalledItems = getItemsMatchResponse.Items.map(item => unmarshall(item));
            const team = unmarshalledItems[0]?.team;
            const opponent = unmarshalledItems[0]?.opponent;

            for (const unmarshalledItem of unmarshalledItems) {
                if (unmarshalledItem.event_type === 'goal') {
                    stats_counter.total_goals++;
                }
                if (unmarshalledItem.event_type === 'foul') {
                    stats_counter.total_fouls++;
                }
                if (unmarshalledItem.event_type === 'passing' || unmarshalledItem.event_type === 'pass') {
                    stats_counter.total_passing_count++;
                    if (unmarshalledItem.team === team) {
                        stats_counter.total_team_passing++;
                    }
                }
            }
            // Lets calculate the ball passing percentage
            const ball_possession = stats_counter.total_passing_count != 0 ? (stats_counter.total_team_passing / stats_counter.total_passing_count) * 100 : 0;
            const ball_possession_percentage = `${ball_possession}%`
            return {
                statusCode: 200,
                body: JSON.stringify({
                    status: "success",
                    match_id: matchId,
                    statistics: {
                        team: team,
                        opponent: opponent,
                        total_goals: stats_counter.total_goals,
                        total_fouls: stats_counter.total_fouls,
                        ball_possession_percentage: ball_possession_percentage

                    }
                })
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    status: "failed", 
                    message: `Match with Match ID: ${matchId} not found!`
                })
            };
            
        }
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify(`The request given doesn't have the match_id in the parameters.`)
        };
    }
}