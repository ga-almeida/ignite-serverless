import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 } from 'uuid';

import { document } from "../utils/dynamodbClient";

interface ICreateTodo {
  title: string;
  deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;
  const { userId } = event.pathParameters;

  await document.put({
    TableName: "todos_users",
    Item: {
      id: v4(),
      user_id: userId,
      title,
      done: false,
      deadline: new Date(deadline)
    }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Create todo!",
    }),
    headers: {
      "Content-type": "applications/json",
    },
  };
}