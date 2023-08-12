import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";



export async function getMatches(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    const result = await ddbClient.send(new ScanCommand({
        TableName: process.env.TABLE_NAME,
    }));

    if (!result.Items) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                status: "error",
                message: "No matches found."
            })
        };
    }

    const uniqueMatchIds = new Set();
    const uniqueMatches = [];

    result.Items.forEach(item => {
        const unmarshalledItem = unmarshall(item);
        const matchId = unmarshalledItem.match_id;

        if (!uniqueMatchIds.has(matchId)) {
            uniqueMatchIds.add(matchId);
            uniqueMatches.push({
                match_id: matchId,
                team: unmarshalledItem.team,
                opponent: unmarshalledItem.opponent,
                date: unmarshalledItem.timestamp
            });
        }
    });

    return {
        statusCode: 200,
        body: JSON.stringify({
            status: "success",
            matches: uniqueMatches
        })
    };
}