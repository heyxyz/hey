# STS token generator worker

STS Cloudflare Worker for uploading media to 4EVERLAND S3-based IPFS bucket

This document describes how to create a Cloudflare Worker that generates STS tokens for uploading media to a 4EVERLAND S3-based IPFS bucket. The generated STS tokens will be valid for 900 seconds.

## Setup

- Signup to 4EVERLAND [here](https://dashboard.4everland.org/) with your wallet
- Create an S3-compatible IPFS bucket [here](https://dashboard.4everland.org/bucket/storage/) [here](https://dashboard.4everland.org/bucket/create)
- Generate **Master key** (api key and api secret key) [here](https://dashboard.4everland.org/bucket/access-keys)
- Add the following environment variables to your `.dev.vars` file:
  - `EVER_ACCESS_KEY` - the api key of the 4EVERLAND account
  - `EVER_ACCESS_SECRET` - the api secret key of the 4EVERLAND account
