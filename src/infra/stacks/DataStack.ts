import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../Utils';


export class DataStack extends Stack {

    public readonly sportsTable: ITable

    constructor(scope: Construct, id: string, props?: StackProps){
        super(scope, id, props)

        const suffix = getSuffixFromStack(this);

        this.sportsTable = new Table(this, 'SportTable', {
            partitionKey : {
                name: 'id',
                type: AttributeType.STRING
            },
            tableName: `SportTable-${suffix}`
        })
    }
}