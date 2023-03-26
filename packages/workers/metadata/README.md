# Metadata worker

Metadata Worker: Posting JSON Metadata to Arweave via Bundlr

This document describes how to create a Cloudflare Worker that posts JSON metadata of a publication and profile to Arweave via Bundlr.

All metadata will be uploaded to **node2** in Bundlr, it means if metadata size is below 100KB it can be uploaded for free.

## Prerequisites

- A EVM address's private key
- Add the following environment variables to your `.dev.vars` file:
  - `BUNDLR_PRIVATE_KEY` - the private key of the EVM address
