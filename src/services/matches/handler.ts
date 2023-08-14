import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getMatches } from "./GetMatches";
import { MissingFieldError } from "../shared/Validator";

const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    let message: string;

    try {
        switch (event.httpMethod) {
            case 'GET':
                const getResponse = await getMatches(event, ddbClient);
                return getResponse;
            default:
                break;
        }
    } catch (error) {
        console.error(error)
        if (error instanceof MissingFieldError) {
            return {
                statusCode: 400,
                body: JSON.stringify(error.message)
            }
        }
        return {
            statusCode: 500,
            body: JSON.stringify(error.message)
        }

    }
}

export { handler }