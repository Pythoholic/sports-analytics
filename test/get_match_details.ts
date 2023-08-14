import { handler } from "../src/services/matches/handler";

process.env.AWS_REGION = 'ap-south-1';
process.env.TABLE_NAME = 'SportTable-02dff94f18a2';

const match_id = '67890';
const event = {
    httpMethod: 'GET',
    path: `/matches/${match_id}`
} as any;

handler(event, {} as any)
    .then(response => {
        console.log("Response:", response);
    })
    .catch(error => {
        console.error("Error:", error);
    });
