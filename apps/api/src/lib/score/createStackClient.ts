import { StackClient } from '@stackso/js-core';

const createStackClient = (pointSystemId: number) => {
  return new StackClient({
    apiKey: process.env.STACK_SO_API_KEY!,
    pointSystemId
  });
};

export default createStackClient;
