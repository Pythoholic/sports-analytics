import { DeleteItemCommand, DynamoDBClient, GetItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";



export async function deleteSports(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult>  {
    

    if (event.queryStringParameters && ('id' in event.queryStringParameters)) {
        
        const sportsId = event.queryStringParameters['id'];
        
        await ddbClient.send(new DeleteItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                'id': {S: sportsId}
            }
        }));

        return{
            statusCode: 200,
            body: JSON.stringify(`Deleted sports with id ${sportsId}`)
        }
    }
    return {
        statusCode: 400,
        body: JSON.stringify('Please provide right ID')
    }

}