#!/bin/bash

# Define the API endpoint URL
API_URL="https://5hefg49d88.execute-api.ap-south-1.amazonaws.com/prod/ingest"

# Read the JSON data from the file and iterate over each event
cat sportsevents.json | jq -c '.[]' | while read -r item; do
  # Make a POST request to the API endpoint
  curl -X POST -H "Content-Type: application/json" -d "$item" "$API_URL"
  
  # Add a sleep to simulate some delay between requests (optional)
  sleep 1
done