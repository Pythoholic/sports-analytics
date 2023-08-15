import { handler } from "../src/services/matchDetails/handler";

process.env.AWS_REGION = 'ap-south-1';
process.env.TABLE_NAME = 'SportTable-0a586b208460';

const match_id = '12345';
const event = {
    httpMethod: 'GET',
    pathParameters: { match_id: "12345" },
    path: `/matches/${match_id}`
} as any;

handler(event, {} as any)
    .then(response => {
        console.log("Response:", response);
    })
    .catch(error => {
        console.error("Error:", error);
    });
