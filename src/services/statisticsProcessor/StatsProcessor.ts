import { DynamoDBClient, PutItemCommand, AttributeValue as DDBAttributeValue, GetItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { AttributeValue } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";

/* This is to update the statistics table for team stats
we will get an event from an INSERT Operation to the SportsTable
We need to process each event and store the stats in the Statistics Table.
*/

export async function statsProcessor(newImage: { [key: string]: AttributeValue }) {
    try {
        const ddbClient = new DynamoDBClient({});
        const item: { [key: string]: DDBAttributeValue } = newImage as any;

        const event_team_name = item.team.S;
        const opponent_team_name = item.opponent.S;
        const matchId = item.match_id.S;

        // In event we need to check the team name and get all stats based on that team from statistics table
        const getItemsStatsTeamsResponse = await ddbClient.send(new GetItemCommand({
            TableName: process.env.STATISTICS_TABLE_NAME,
            Key: {
                'team': { S: event_team_name }
            }
        }));

        // Let suppose this is the first event, then the stats would have a starting value
        // The next time it recieves an event we need to check the SportsTable for events
        if (!getItemsStatsTeamsResponse.Item) {
            const start_data_initial_team = {
                "team": { S: event_team_name },
                "total_matches": { N: "1" },
                "total_wins": { N: "0" },
                "total_draws": { N: "0" },
                "total_losses": { N: "0" },
                "total_goals_scored": { N: "0" },
                "total_fouls": { N: "0" },
                "total_goals_conceded": { N: "0" }
            }

            await ddbClient.send(new PutItemCommand({
                TableName: process.env.STATISTICS_TABLE_NAME,
                Item: start_data_initial_team
            }));

            const start_data_initial_opponent = {
                "team": { S: event_team_name },
                "total_matches": { N: "1" },
                "total_wins": { N: "0" },
                "total_draws": { N: "0" },
                "total_losses": { N: "0" },
                "total_goals_scored": { N: "0" },
                "total_fouls": { N: "0" },
                "total_goals_conceded": { N: "0" }
            }

            await ddbClient.send(new PutItemCommand({
                TableName: process.env.STATISTICS_TABLE_NAME,
                Item: start_data_initial_opponent
            }));
        }

        // Once we have set the initial row for our stats table
        // We can add our update stats based on the event we get
        let update_expression_stats = "";
        let expression_attrib_value: { [key: string]: DDBAttributeValue } = {};

        console.log("Item:", item);
        console.log("EVENT:", item.event_type.S)

        switch (item.event_type.S) {
            case "goal":
                update_expression_stats = "SET total_goals_scored = total_goals_scored + :incrementValue";
                expression_attrib_value = {
                    ":incrementValue": { N: "1" }
                };
                break;
            case "foul":
                update_expression_stats = "SET total_fouls = total_fouls + :incrementValue";
                expression_attrib_value = {
                    ":incrementValue": { N: "1" }
                };
                break;
        }

        if (update_expression_stats && expression_attrib_value) {
            // Now lets update the event team stats
            await ddbClient.send(new UpdateItemCommand({
                TableName: process.env.STATISTICS_TABLE_NAME,
                Key: {
                    'team': { S: event_team_name }
                },
                UpdateExpression: update_expression_stats,
                ExpressionAttributeValues: expression_attrib_value
            }));
        }

        // Now if the goal is scored we can update the opponent team
        if (item.event_type.S === 'goal') {
            const update_expression_stats_opponent = "SET total_goals_conceded = total_goals_conceded + :incrementValue";
            const expression_attrib_value_opponent = {
                ":incrementValue": { N: "1" }
            };
            await ddbClient.send(new UpdateItemCommand({
                TableName: process.env.STATISTICS_TABLE_NAME,
                Key: {
                    'team': { S: opponent_team_name }
                },
                UpdateExpression: update_expression_stats_opponent,
                ExpressionAttributeValues: expression_attrib_value_opponent
            }));
        }


        if (item.event_type.S === "match_end") {
            console.log("Received match ID:", matchId);
            const getItemsMatchResponse = await ddbClient.send(new ScanCommand({
                TableName: process.env.TABLE_NAME,
                FilterExpression: "match_id = :matchId",
                ExpressionAttributeValues: {
                    ":matchId": { S: matchId }
                }
            }));

            let stats_counter = {
                total_goals_team: 0,
                total_goals_opponent: 0
            }
            console.log("getItemsMatchResponse:", getItemsMatchResponse)

            if (getItemsMatchResponse.Items && getItemsMatchResponse.Items.length > 0) {
                const unmarshalledItems = getItemsMatchResponse.Items.map(item => unmarshall(item));
                const team = unmarshalledItems[0]?.team;
                const opponent = unmarshalledItems[0]?.opponent;

                for (const unmarshalledItem of unmarshalledItems) {
                    if (unmarshalledItem.event_type === 'goal' && unmarshalledItem.team === team) {
                        stats_counter.total_goals_team++;
                    } else if (unmarshalledItem.event_type === 'goal' && unmarshalledItem.team === opponent) {
                        stats_counter.total_goals_opponent++;
                    }
                }

                if (stats_counter.total_goals_team > stats_counter.total_goals_opponent) {
                    const update_expression_stats = "SET total_wins = total_wins + :incrementValue";
                    const expression_attrib_value = {
                        ":incrementValue": { N: "1" }
                    };
                    await ddbClient.send(new UpdateItemCommand({
                        TableName: process.env.STATISTICS_TABLE_NAME,
                        Key: {
                            'team': { S: team }
                        },
                        UpdateExpression: update_expression_stats,
                        ExpressionAttributeValues: expression_attrib_value
                    }));

                    const update_expression_stats_opp = "SET total_losses = total_losses + :incrementValue";
                    const expression_attrib_value_opp = {
                        ":incrementValue": { N: "1" }
                    };
                    await ddbClient.send(new UpdateItemCommand({
                        TableName: process.env.STATISTICS_TABLE_NAME,
                        Key: {
                            'team': { S: opponent }
                        },
                        UpdateExpression: update_expression_stats_opp,
                        ExpressionAttributeValues: expression_attrib_value_opp
                    }));

                } else if (stats_counter.total_goals_team === stats_counter.total_goals_opponent) {
                    const update_expression_stats = "SET total_draws = total_draws + :incrementValue";
                    const expression_attrib_value = {
                        ":incrementValue": { N: "1" }
                    };
                    await ddbClient.send(new UpdateItemCommand({
                        TableName: process.env.STATISTICS_TABLE_NAME,
                        Key: {
                            'team': { S: team }
                        },
                        UpdateExpression: update_expression_stats,
                        ExpressionAttributeValues: expression_attrib_value
                    }));
                    await ddbClient.send(new UpdateItemCommand({
                        TableName: process.env.STATISTICS_TABLE_NAME,
                        Key: {
                            'team': { S: opponent }
                        },
                        UpdateExpression: update_expression_stats,
                        ExpressionAttributeValues: expression_attrib_value
                    }));
                }
            }

        }

    } catch (error) {
        console.log(error);
    }
}
