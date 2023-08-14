import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";
import { validateAsSportsEntry } from "../shared/Validator";
import { marshall } from "@aws-sdk/util-dynamodb";


export async function postSports(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    try {
        const randomId = v4();
        const item = JSON.parse(event.body);
        //item.id = randomId
        //validateAsSportsEntry(item)

        const result = await ddbClient.send(new PutItemCommand({
            TableName: process.env.TABLE_NAME,
            Item: marshall(item)
        }));
        console.log(result);

        return {
            statusCode: 201,
            body: JSON.stringify({
                status: "success",
                message: "Data successfully ingested.",
                data: {
                    event_id: randomId,
                    timestamp: item.timestamp
                }
            })
        }
    } catch (error) {
        console.error(error);
        let errorMessage = "Failed to ingest data.";
        return {
            statusCode: 400,
            body: JSON.stringify({
                status: "error",
                message: errorMessage,
                error: error.message
            })
        };

    }


}