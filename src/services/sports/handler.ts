import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { postSports } from "./PostSports";
import { getSports } from "./GetSports";
import { updateSports } from "./UpdateSports";
import { deleteSports } from "./DeleteSports";

const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    let message: string;

    try {
        switch (event.httpMethod){
            case 'GET':
                const getResponse =  await getSports(event, ddbClient);
                return getResponse;
            case 'POST':
                const postResponse =  await postSports(event, ddbClient);
                return postResponse;
            case 'PUT':
                const putResponse =  await updateSports(event, ddbClient);
                return putResponse;
            case 'DELETE':
                const deleteResponse =  await deleteSports(event, ddbClient);
                return deleteResponse;
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