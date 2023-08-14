import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";



export async function getTeamStatistics(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult>  {
    try {
        const teamName = event.pathParameters?.team_name;
        const decodedTeamName = decodeURIComponent(teamName || '');
        console.log("Received team name:", decodedTeamName);

        if (!teamName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ status: "error", message: "Team name is required." })
            };
        }

        const result = await ddbClient.send(new GetItemCommand({
            TableName: process.env.STATISTICS_TABLE_NAME,
            Key: {
                'team': {S: decodedTeamName}
            }
        }));

        if (result.Item){
            const unmarshalledItem = unmarshall(result.Item)
            return {
                statusCode: 200,
                body: JSON.stringify(unmarshalledItem)
            }
        }
        else{
            return {
                statusCode: 401,
                body: JSON.stringify(`Sports with ID ${decodedTeamName} not Found!`)
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                status: "failed",
                error: error.message
            })
        };
    }
    
}