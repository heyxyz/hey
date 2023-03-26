# STS token generator worker

STS Cloudflare Worker for uploading media to 4EVERLAND S3-based IPFS bucket

This document describes how to create a Cloudflare Worker that generates STS tokens for uploading media to a 4EVERLAND S3-based IPFS bucket. The generated STS tokens will be valid for 900 seconds.

## Prerequisites

- A 4EVERLAND account and an S3-compatible IPFS bucket created [here](https://dashboard.4everland.org/bucket/storage/)
- Master key and secret key of the S3-compatible IPFS bucket created [here](https://dashboard.4everland.org/bucket/access-keys)
