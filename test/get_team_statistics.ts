import { handler } from "../src/services/teamStatistics/handler";

process.env.AWS_REGION = 'ap-south-1';
process.env.STATISTICS_TABLE_NAME = 'StatisticsTable-0a76b266a586';

const team_name = "FC Barcelona";
const event = {
    httpMethod: 'GET',
    pathParameters: { team_name: "FC Barcelona" },
    path: `/teams/${team_name}/statistics`
} as any;

handler(event, {} as any)
    .then(response => {
        console.log("Response:", response);
    })
    .catch(error => {
        console.error("Error:", error);
    });
