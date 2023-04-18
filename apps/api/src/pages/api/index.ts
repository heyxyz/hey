import type { Context } from '@gql/builder';
import { createGraphQLContext } from '@gql/builder';
import { schema } from '@gql/index';
import type { ExecutionResult } from 'graphql';
import { getGraphQLParameters, processRequest, renderGraphiQL, shouldRenderGraphiQL } from 'graphql-helix';
import type { IncomingHttpHeaders } from 'http';
import type { NextApiHandler } from 'next';

function formatResult(result: ExecutionResult) {
  const formattedResult: ExecutionResult = {
    data: result.data
  };

  if (result.errors) {
    formattedResult.errors = result.errors.map((error) => {
      return error;
    });
  }

  return formattedResult;
}

interface GraphQLRequest {
  body?: any;
  headers: IncomingHttpHeaders;
  method: string;
  query: any;
}

const handler: NextApiHandler = async (req, res) => {
  try {
    const request: GraphQLRequest = {
      headers: req.headers,
      method: req.method ?? 'GET',
      query: req.query,
      body: req.body
    };

    if (shouldRenderGraphiQL(request)) {
      res.setHeader('Content-Type', 'text/html');
      res.send(
        renderGraphiQL({
          endpoint: '/'
        })
      );
    } else {
      const { operationName, query, variables } = getGraphQLParameters(request);

      const result = await processRequest<Context>({
        operationName,
        query,
        variables,
        request,
        schema,
        contextFactory: () => createGraphQLContext(req, res)
      });

      if (result.type !== 'RESPONSE') {
        throw new Error(`Unsupported response type: "${result.type}"`);
      }

      for (const { name, value } of result.headers) {
        res.setHeader(name, value);
      }
      res.status(result.status);
      res.json(formatResult(result.payload));
    }
  } catch (error) {
    res.status(500);
    res.end(String(error));
  }
};

export default handler;
