import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { postSports } from "./PostSports";
import { getSports } from "./GetSports";

const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    let message: string;

    try {
        switch (event.httpMethod){
            case 'GET':
                const getResponse =  getSports(event, ddbClient);
                return getResponse;
            case 'POST':
                const postResponse =  postSports(event, ddbClient);
                return postResponse;
            default:
                break;
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 500,
            body: JSON.stringify(error.message)
        }
        
    }

    const response: APIGatewayProxyResult = {
        statusCode:200,
        body: JSON.stringify(message)
    }
    
    return response;
}

export {handler}