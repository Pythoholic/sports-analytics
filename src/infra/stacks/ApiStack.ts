import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
    sportsLambdaIntegration: LambdaIntegration
}
export class ApiStack extends Stack {

    constructor(scope: Construct, id: string, props: ApiStackProps){
        super(scope, id, props)

        const api = new RestApi(this, 'SportsApi');
        const sportsResource = api.root.addResource('sports');
        sportsResource.addMethod('GET', props.sportsLambdaIntegration)
        sportsResource.addMethod('POST', props.sportsLambdaIntegration)
    }
}