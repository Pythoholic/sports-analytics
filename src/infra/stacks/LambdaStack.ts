import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

interface LambdaStackProps extends StackProps {
    sportsTable: ITable;
    statisticsTable: ITable;
}

export class LambdaStack extends Stack {

    public readonly ingestLambdaIntegration: LambdaIntegration;
    public readonly matchesLambdaIntegration: LambdaIntegration;
    public readonly matchDetailsLambdaIntegration: LambdaIntegration;
    public readonly matchStatisticsLambdaIntegration: LambdaIntegration;
    public readonly teamStatisticsLambdaIntegration: LambdaIntegration;
    public readonly statisticsLambdaIntegration: LambdaIntegration;

    constructor(scope: Construct, id: string, props?: LambdaStackProps) {
        super(scope, id, props);

        // Ingest Lambda
        const ingestLambda = this.createLambda('IngestLambda', 'ingest/handler.ts', props.sportsTable);
        this.ingestLambdaIntegration = new LambdaIntegration(ingestLambda);

        // Matches Lambda
        const matchesLambda = this.createLambda('MatchesLambda', 'matches/handler.ts', props.sportsTable);
        this.matchesLambdaIntegration = new LambdaIntegration(matchesLambda);

        const matchDetailsLambda = this.createLambda('MatchDetailsLambda', 'matchDetails/handler.ts', props.sportsTable);
        this.matchDetailsLambdaIntegration = new LambdaIntegration(matchDetailsLambda);

        const matchStatisticsLambda = this.createLambda('MatchStatisticsLambda', 'matchStatistics/handler.ts', props.sportsTable);
        this.matchStatisticsLambdaIntegration = new LambdaIntegration(matchStatisticsLambda);

        const teamStatisticsLambda = this.createLambda('TeamStatisticsLambda', 'teamStatistics/handler.ts', props.sportsTable);
        this.teamStatisticsLambdaIntegration = new LambdaIntegration(teamStatisticsLambda);

        // Statistics Lambda (new)
        const statisticsLambda = this.createLambda('StatisticsLambda', 'statistics/handler.ts', props.statisticsTable);
        this.statisticsLambdaIntegration = new LambdaIntegration(statisticsLambda);
    }

    private createLambda(name: string, entryPath: string, table: ITable): NodejsFunction {
        const lambda = new NodejsFunction(this, name, {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: join(__dirname, '..', '..', 'services', entryPath),
            environment: {
                TABLE_NAME: table.tableName,
            },
        });

        lambda.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                resources: [table.tableArn],
                actions: [
                    'dynamodb:PutItem',
                    'dynamodb:GetItem',
                    'dynamodb:UpdateItem',
                    'dynamodb:Scan',
                    'dynamodb:DeleteItem',
                ],
            })
        );

        return lambda;
    }
}