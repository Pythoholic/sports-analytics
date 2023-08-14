import { handler } from "../src/services/matchStatistics/handler";

process.env.AWS_REGION = 'ap-south-1';
process.env.TABLE_NAME = 'SportTable-0a554d71a646';

const match_id = "12345";
const event = {
    httpMethod: 'GET',
    pathParameters: { match_id: "12345" },
    path: `/matches/${match_id}/statistics`
} as any;

handler(event, {} as any)
    .then(response => {
        console.log("Response:", response);
    })
    .catch(error => {
        console.error("Error:", error);
    });
