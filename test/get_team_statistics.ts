import { handler } from "../src/services/teamStatistics/handler";

process.env.AWS_REGION = 'ap-south-1';
process.env.STATISTICS_TABLE_NAME = 'StatisticsTable-02dff94f18a2';

const team_name = "Manchester United";
const event = {
    httpMethod: 'GET',
    pathParameters: { team_name: "Manchester United" },
    path: `/teams/${team_name}/statistics`
} as any;

handler(event, {} as any)
    .then(response => {
        console.log("Response:", response);
    })
    .catch(error => {
        console.error("Error:", error);
    });
