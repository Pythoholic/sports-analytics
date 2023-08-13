import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";



export async function getMatches(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult>  {
    
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

    const matches = result.Items.map(item => {
        const unmarshalledItem = unmarshall(item);
        return {
            match_id: unmarshalledItem.match_id,
            team: unmarshalledItem.team,
            opponent: unmarshalledItem.opponent,
            date: unmarshalledItem.timestamp 
        };
    });

    return {
        statusCode: 200,
        body: JSON.stringify({
            status: "success",
            matches: matches
        })
    };
}