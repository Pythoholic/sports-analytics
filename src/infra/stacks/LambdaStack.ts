import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
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

        // Ingest Lambda - For the POST Calls
        const ingestLambda = this.createLambda('IngestLambda', 'ingest/handler.ts', props.sportsTable, props.sportsTable);
        this.ingestLambdaIntegration = new LambdaIntegration(ingestLambda);

        // Matches Lambda - For the GET Calls
        const matchesLambda = this.createLambda('MatchesLambda', 'matches/handler.ts', props.sportsTable, props.sportsTable);
        this.matchesLambdaIntegration = new LambdaIntegration(matchesLambda);

        const matchDetailsLambda = this.createLambda('MatchDetailsLambda', 'matchDetails/handler.ts', props.sportsTable, props.sportsTable);
        this.matchDetailsLambdaIntegration = new LambdaIntegration(matchDetailsLambda);

        const matchStatisticsLambda = this.createLambda('MatchStatisticsLambda', 'matchStatistics/handler.ts', props.sportsTable, props.sportsTable);
        this.matchStatisticsLambdaIntegration = new LambdaIntegration(matchStatisticsLambda);

        // Statistics Lambda (new) : TODO : Need to create code for this to keep the statistics in a separate Database.
        const statisticsLambda = this.createLambda('StatisticsLambda', 'teamStatistics/handler.ts', props.sportsTable, props.statisticsTable);
        this.teamStatisticsLambdaIntegration = new LambdaIntegration(statisticsLambda);

        // Processing Statistics Lambda 
        const statisticsProcessorLambda = new NodejsFunction(this, 'StatisticsProcessorLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: join(__dirname, '..', '..', 'services', 'statisticsProcessor/handler.ts'),
            environment: {
                STATISTICS_TABLE_NAME: props.statisticsTable.tableName,
            },
        });

        statisticsProcessorLambda.addEventSource(new DynamoEventSource(props.sportsTable, {
            startingPosition: StartingPosition.TRIM_HORIZON,
            batchSize: 5,
        }));

        statisticsProcessorLambda.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                resources: [props.statisticsTable.tableArn],
                actions: [
                    'dynamodb:PutItem',
                    'dynamodb:UpdateItem',
                ],
            })
        );
    }

    private createLambda(name: string, entryPath: string, table: ITable, statisticsTable: ITable): NodejsFunction {
        const lambda = new NodejsFunction(this, name, {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: join(__dirname, '..', '..', 'services', entryPath),
            environment: {
                TABLE_NAME: table.tableName,
                STATISTICS_TABLE_NAME: statisticsTable.tableName,
            },
        });

        lambda.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                resources: [table.tableArn, statisticsTable.tableArn],
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