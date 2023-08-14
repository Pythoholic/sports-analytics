import { App } from 'aws-cdk-lib';
import { DataStack } from './stacks/DataStack';
import { LambdaStack } from './stacks/LambdaStack';
import { ApiStack } from './stacks/ApiStack';


const app = new App();
const dataStack = new DataStack(app, 'DataStack');
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
    sportsTable: dataStack.sportsTable,
    statisticsTable: dataStack.statisticsTable
});
new ApiStack(app, 'ApiStack', {
    ingestLambdaIntegration: lambdaStack.ingestLambdaIntegration,
    matchesLambdaIntegration: lambdaStack.matchesLambdaIntegration,
    matchDetailsLambdaIntegration: lambdaStack.matchDetailsLambdaIntegration,
    matchStatisticsLambdaIntegration: lambdaStack.matchStatisticsLambdaIntegration,
    teamStatisticsLambdaIntegration: lambdaStack.teamStatisticsLambdaIntegration
})