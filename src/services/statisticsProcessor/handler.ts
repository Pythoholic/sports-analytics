import { Context, DynamoDBStreamEvent } from "aws-lambda";
import { statsProcessor } from "./StatsProcessor";


async function handler(event: DynamoDBStreamEvent, context: Context) {

    try {
        for (const record of event.Records){
            if (record.eventName === 'INSERT' && record.dynamodb?.NewImage) {
                await statsProcessor(record.dynamodb.NewImage);
            }
        }
        
    } catch (error) {
        console.error(error)
        
    }
    
}

export { handler };