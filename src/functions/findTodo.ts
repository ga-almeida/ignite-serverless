import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userId } = event.pathParameters;

  const response = await document.scan({
    TableName: "todos_users",
    FilterExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
      ":user_id": userId
    }
  }).promise();

  const findTodosUser = response.Items;

  if (findTodosUser) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        todos: findTodosUser
      }),
      headers: {
        "Content-type": "applications/json",
      },
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: `Does not exists todo with user ID: ${userId}!`,
    }),
    headers: {
      "Content-type": "applications/json",
    },
  };
}