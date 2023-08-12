#!/bin/bash

# Validate if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js and try again."
    exit 1
else
    echo "Node.js is already installed."
fi

# Validate if AWS CLI is installed
if ! command -v aws &> /dev/null
then
    echo "AWS CLI is not installed. Please install AWS CLI and try again."
    exit 1
else
    echo "AWS CLI is already installed."
fi

# Validate if CDK is installed
if ! command -v cdk &> /dev/null
then
    echo "AWS CDK is not installed. Installing..."
    npm install -g aws-cdk
fi

# Install project dependencies
echo "Installing project dependencies..."
npm install --save-dev
npm install typescript --save-dev

# Compile TypeScript files
echo "Compiling TypeScript files..."
cdk synth

# Deploy the CDK stack
echo "Deploying the CDK stack..."
cdk deploy --all

echo "Installation and deployment complete!"
