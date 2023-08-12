import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";



export async function getSports(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult>  {
    

    if (event.queryStringParameters) {
        if ('id' in event.queryStringParameters){
            const sportsId = event.queryStringParameters['id'];
            const getItemResponse = await ddbClient.send(new GetItemCommand({
                TableName: process.env.TABLE_NAME,
                Key: {
                    'id': {S: sportsId}
                }
            }))
            if (getItemResponse.Item){
                return {
                    statusCode: 200,
                    body: JSON.stringify(getItemResponse.Item)
                }
            }else{
                return {
                    statusCode: 401,
                    body: JSON.stringify(`Sports with ID ${sportsId} not Found!`)
                }
            }
        }else{
            return {
                statusCode: 401,
                body: JSON.stringify('ID Required. Please provide the ID to query.')
            }
        }
    }

    const result = await ddbClient.send(new ScanCommand({
        TableName: process.env.TABLE_NAME,
    }));
    console.log(result.Items);

    return {
        statusCode: 201,
        body: JSON.stringify(result.Items)
    }
}