import { handler } from "../src/services/matches/handler";

process.env.AWS_REGION = 'ap-south-1';
process.env.TABLE_NAME = 'SportTable-0a586b208460';

const event = {
    httpMethod: 'GET',
    path: "/matches"
  } as any;
  
handler(event, {} as any)
    .then(response => {
        console.log("Response:", response);
    })
    .catch(error => {
        console.error("Error:", error);
    });