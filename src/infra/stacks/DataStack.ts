import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, ITable, Table, StreamViewType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../Utils';


export class DataStack extends Stack {

    public readonly sportsTable: ITable;
    public readonly statisticsTable: ITable;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        const suffix = getSuffixFromStack(this);

        // Table for Ingest
        this.sportsTable = new Table(this, 'SportTable', {
            partitionKey: {
                name: 'match_id',
                type: AttributeType.STRING
            },
            sortKey: {
                name: 'timestamp',
                type: AttributeType.STRING
            },
            removalPolicy: RemovalPolicy.DESTROY,
            tableName: `SportTable-${suffix}`,
            stream: StreamViewType.NEW_IMAGE
        });

        // Table for Statistics
        this.statisticsTable = new Table(this, 'StatisticsTable', {
            partitionKey: {
                name: 'team',
                type: AttributeType.STRING
            },
            removalPolicy: RemovalPolicy.DESTROY,
            tableName: `StatisticsTable-${suffix}`
        });
    }
}