import { DynamoDBClient, PutItemCommand, AttributeValue as DDBAttributeValue } from "@aws-sdk/client-dynamodb";
import { AttributeValue } from "aws-lambda";
import { marshall } from "@aws-sdk/util-dynamodb";


export async function statsProcessor(newImage: { [key: string]: AttributeValue }) {
    try {
        console.log(newImage);
        const ddbClient = new DynamoDBClient({});
        const item: { [key: string]: DDBAttributeValue } = newImage as any;

        const result = await ddbClient.send(new PutItemCommand({
            TableName: process.env.STATISTICS_TABLE_NAME,
            Item: item,
        }));
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}
