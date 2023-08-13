# Sports Match Analytics Service

Design and implement a cloud-native Sports Analytics Platform using AWS services, AWS CDK, and TypeScript. This project provides a serverless solution to ingest, manage, and retrieve sports match data and statistics. It leverages AWS Lambda functions, API Gateway, and DynamoDB to provide a scalable and efficient system.

## Features
- Ingest Sports Data: Allows ingestion of sports match data including match details, events, and player information.
- Retrieve Match Details: Retrieve detailed information about a specific match including all events.
- Match Statistics: Calculate and store match statistics such as total goals, total fouls, and ball possession percentage.
- Team Statistics: Calculate and store team statistics such as total matches, total wins, total draws, total losses, total goals scored, and total goals conceded.

## Architecture
The system is built using AWS services:

- AWS Lambda: Serverless functions to handle the business logic.
- API Gateway: Provides the endpoints for the API.
- DynamoDB: Used to store the match data and statistics.

# Setup and Deployment
## Prerequisites
- AWS CLI
- AWS CDK
- Node.js 18.x
- TypeScript

## Configure AWS CLI
Make sure you have the AWS CLI installed and configured with the appropriate credentials. You can configure it by running:
```
aws configure
```
This command will prompt you to enter your AWS Access Key ID, Secret Access Key, default region, and default output format. Make sure to enter the credentials for the account where you want to deploy the CDK stack.
There are other ingestion ways for credentials, but for simplicity, you can provide your AWS credentials here as well.

## Deployment Steps

### Clone the Repository:
```
https://github.com/Pythoholic/sports-analytics.git
cd sports-analytics
```
### Install Dependencies:
```
npm install
```
### Compile the CDK Application:
```
cdk synth
```
### Deploy the Stack:
```
cdk deploy --all
```

Once you have compiled and deployed your resources properly. It will provide you with a endpoint to interact with.
For example: 
```
 ✅  ApiStack

✨  Deployment time: 34.1s

Outputs:
ApiStack.SportsApiEndpoint9C0737D6 = https://ood8fkozj4.execute-api.ap-south-1.amazonaws.com/prod/
Stack ARN:
arn:aws:cloudformation:ap-south-1:134793429233:stack/ApiStack/1ce6a480-396d-11ee-9053-02165d5d667c

✨  Total time: 37.43s
```

This is the endpoint: https://ood8fkozj4.execute-api.ap-south-1.amazonaws.com/prod/
This will be different based on your region and unique id.

## Endpoint and API Interactions
API Endpoints
- Ingest Sports Data: POST /ingest
- Retrieve Matches: GET /matches
- Retrieve Match Details: GET /matches/{match_id}
- Retrieve Match Statistics: GET /statistics/matches/{match_id} // Under development
- Retrieve Team Statistics: GET /statistics/teams/{team_name} // Under development

## Usage patterns and expected output:

- Ingest Sports Data: POST /ingest
- POST https://ood8fkozj4.execute-api.ap-south-1.amazonaws.com/prod/ingest
- Body:
```
{
	"match_id": "67890",
	"timestamp": "2023-08-11T20:30:00Z",
	"team": "Manchester United",
	"opponent": "Chelsea",
	"event_type": "goal",
	"event_details": {
		"player": {
			"name": "Cristiano Ronaldo",
			"position": "Forward",
			"number": 7
		},
		"goal_type": "free-kick",
		"minute": 55,
		"assist": {
			"name": "Bruno Fernandes",
			"position": "Midfielder",
			"number": 18
		},
		"video_url": "https://example.com/free_kick_goal_video.mp4"
	}
}
```
- Response:
```
{
	"status": "success",
	"message": "Data successfully ingested.",
	"data": {
		"event_id": "9e30cb4c-d0a9-4519-924d-92178455a83d",
		"timestamp": "2023-08-11T20:30:00Z"
	}
}
```

- Retrieve Matches: GET /matches

- GET https://ood8fkozj4.execute-api.ap-south-1.amazonaws.com/prod/matches
- Response:
```
{
	"status": "success",
	"matches": [
		{
			"match_id": "54321",
			"team": "Liverpool",
			"opponent": "Arsenal",
			"date": "2023-08-10T18:00:00Z"
		},
		{
			"match_id": "67890",
			"team": "Manchester United",
			"opponent": "Chelsea",
			"date": "2023-08-11T20:30:00Z"
		},
		{
			"match_id": "67890",
			"team": "Liverpool FC",
			"opponent": "Arsenal FC",
			"date": "2023-07-15T18:30:00Z"
		}
	]
}
```
- Retrieve Match Details: GET /matches/{match_id}
- GET https://ood8fkozj4.execute-api.ap-south-1.amazonaws.com/prod/matches/67890
- Response:
```
{
	"status": "success",
	"match": {
		"match_id": "67890",
		"team": "Manchester United",
		"opponent": "Chelsea",
		"date": "2023-08-11T20:30:00Z",
		"events": [
			{
				"event_type": "goal",
				"timestamp": "2023-08-11T20:30:00Z",
				"player": "Cristiano Ronaldo",
				"goal_type": "free-kick",
				"minute": 55,
				"video_url": "https://example.com/free_kick_goal_video.mp4"
			},
			{
				"event_type": "goal",
				"timestamp": "2023-07-15T21:30:00Z",
				"player": "Cristiano Ronaldo",
				"goal_type": "free-kick",
				"minute": 75,
				"video_url": "https://example.com/free_kick_video.mp4"
			},
			{
				"event_type": "goal",
				"timestamp": "2023-07-15T18:30:00Z",
				"goal_type": "free-kick",
				"minute": 75,
				"video_url": "https://example.com/goal_video_sal.mp4"
			}
		]
	}
}
```


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
This project is licensed under the GNU License - see the LICENSE.md file for details.