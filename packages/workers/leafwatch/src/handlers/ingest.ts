// @ts-ignore
import { getTokenFromGCPServiceAccount } from '@sagi.io/workers-jwt';
import { error, type IRequest } from 'itty-router';

import getPrivateKey from '../helpers/getPrivateKey';
import { keysValidator } from '../helpers/keysValidator';
import type { Env } from '../types';

type ExtensionRequest = {
  name: string;
  user_id?: string;
  fingerprint?: string;
  referrer?: string;
  platform?: 'web' | 'mobile';
  properties?: string;
};

const requiredKeys: (keyof ExtensionRequest)[] = ['name'];

export default async (request: IRequest, env: Env) => {
  const body = await request.json();
  if (!body) {
    return error(400, 'Bad request!');
  }

  const { name, user_id, fingerprint, referrer, platform, properties } =
    body as ExtensionRequest;

  const missingKeysError = keysValidator(requiredKeys, body);
  if (missingKeysError) {
    return missingKeysError;
  }

  try {
    // BigQuery details
    const projectName = 'leafwatch';
    const datasetName = 'leafwatch';
    const tableName = 'events';

    // Event details from Cloudflare request
    const country = request.headers.get('cf-ipcountry');

    // Insert ID
    const id = crypto.randomUUID();

    const token = await getTokenFromGCPServiceAccount({
      serviceAccountJSON: {
        type: 'service_account',
        project_id: projectName,
        private_key_id: env.BQ_PRIVATE_KEY_ID,
        private_key: getPrivateKey(env),
        client_email: `${datasetName}@${projectName}.iam.gserviceaccount.com`,
        client_id: '108061307956868790691',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url:
          'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${datasetName}%40${projectName}.iam.gserviceaccount.com`,
        universe_domain: 'googleapis.com'
      },
      aud: 'https://bigquery.googleapis.com/'
    });

    const payload = {
      kind: 'bigquery#tableDataInsertAllResponse',
      rows: [
        {
          insertId: id,
          json: {
            name,
            user_id,
            fingerprint,
            country,
            referrer,
            platform,
            properties: JSON.stringify(properties)
          }
        }
      ]
    };

    const bqResponse = await fetch(
      `https://bigquery.googleapis.com/bigquery/v2/projects/${projectName}/datasets/${datasetName}/tables/${tableName}/insertAll`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          Authorization: 'Bearer ' + token
        }
      }
    );

    const json: { kind: string } = await bqResponse.json();
    if (json.kind !== 'bigquery#tableDataInsertAllResponse') {
      return new Response(
        JSON.stringify({ success: false, error: 'Ingestion failed!' })
      );
    }

    return new Response(JSON.stringify({ success: true, id }));
  } catch (error) {
    console.error('Failed to ingest event', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
