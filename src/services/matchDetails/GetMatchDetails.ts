import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";



export async function getMatchDetails(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    const matchId = event.pathParameters?.match_id;

    if (!matchId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ status: "error", message: "Match ID is required." })
        };
    }

    const result = await ddbClient.send(new ScanCommand({
        TableName: process.env.TABLE_NAME,
        FilterExpression: "match_id = :matchId",
        ExpressionAttributeValues: {
            ":matchId": { S: matchId }
        }
    }));

    if (!result.Items || result.Items.length === 0) {
        return {
            statusCode: 404,
            body: JSON.stringify({ status: "error", message: "Match not found." })
        };
    }

    const events = result.Items.map(item => {
        const unmarshalledItem = unmarshall(item);
        return {
            event_type: unmarshalledItem.event_type,
            timestamp: unmarshalledItem.timestamp,
            player: unmarshalledItem.event_details.player.name,
            goal_type: unmarshalledItem.event_details.goal_type,
            minute: unmarshalledItem.event_details.minute,
            video_url: unmarshalledItem.event_details.video_url
        };
    });

    const matchDetails = {
        match_id: matchId,
        team: result.Items[0].team.S,
        opponent: result.Items[0].opponent.S,
        date: result.Items[0].timestamp.S,
        events: events
    };

    return {
        statusCode: 200,
        body: JSON.stringify({
            status: "success",
            match: matchDetails
        })
    };
}