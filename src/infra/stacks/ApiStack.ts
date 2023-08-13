import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
    ingestLambdaIntegration: LambdaIntegration;
    matchesLambdaIntegration: LambdaIntegration;
    matchDetailsLambdaIntegration: LambdaIntegration;
    matchStatisticsLambdaIntegration: LambdaIntegration;
    teamStatisticsLambdaIntegration: LambdaIntegration;
}
export class ApiStack extends Stack {

    constructor(scope: Construct, id: string, props: ApiStackProps){
        super(scope, id, props)

        const api = new RestApi(this, 'SportsApi');

        // Endpoints for /ingest
        const sportsResource = api.root.addResource('ingest');
        sportsResource.addMethod('GET', props.ingestLambdaIntegration)
        sportsResource.addMethod('POST', props.ingestLambdaIntegration)
        sportsResource.addMethod('PUT', props.ingestLambdaIntegration)
        sportsResource.addMethod('DELETE', props.ingestLambdaIntegration)

        // GET /matches : Retrieve a list of all matches.
        const matchesResource = api.root.addResource('matches');
        matchesResource.addMethod('GET', props.matchesLambdaIntegration);

        // GET /matches/{match_id} : Retrieve details of a specific match.
        const matchIdResource = matchesResource.addResource('{match_id}');
        matchIdResource.addMethod('GET', props.matchDetailsLambdaIntegration);

        // GET /matches/{match_id}/statistics : Retrieve statistics for a specific match.
        const statisticsResource = matchIdResource.addResource('statistics');
        statisticsResource.addMethod('GET', props.matchStatisticsLambdaIntegration);

        // GET /teams/{team_name}/statistics : Retrieve statistics for a specific team across all matches.
        const teamsResource = api.root.addResource('teams');
        const teamNameResource = teamsResource.addResource('{team_name}');
        const teamStatisticsResource = teamNameResource.addResource('statistics');
        teamStatisticsResource.addMethod('GET', props.teamStatisticsLambdaIntegration);

    }
}