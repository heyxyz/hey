# Packages

This folder contains all the shared packages that are used in the Lenster project.

- [ABIs](./abis/README.md) - Contract ABIs
- [Bundlr](./bundlr/README.md) - Create bundles on Arweave
- [Config](./config/README.md) - ESlint and TypeScript config
- [Data](./data/README.md) - Data like constants, storage, etc.
- [Image Cropper](./image-cropper/README.md) - Image cropper avatar and cover
- [Lens](./lens/README.md) - Lens GraphQL client, helpers, and documents
- [Lib](./lib/README.md) - Shared libraries
- [UI](./ui/README.md) - Shared UI components
- [Workers](./workers/README.md) - Cloudflare Workers
  - [Prerender](../packages/workers/prerender/README.md) - Prerender for SEO only for bots
  - [STS Token Generator](../packages/workers/sts-generator/README.md) - Generate S3 Compatible STS token in 4Everland
  - [Metadata](../packages/workers/metadata/README.md) - Create metadata on Arweave via Bundlr
  - [Freshdesk](../packages/workers/freshdesk/README.md) - Create Freshdesk tickets
  - [Snapshot Relay](../packages/workers/snapshot-relay/README.md) - Relayer for Snapshot for Polls and Proposals
  - [ENS Resolver](../packages/workers/ens-resolver/README.md) - Resolve Ethereum address to ENS names
  - [Oembed](../packages/workers/oembed/README.md) - Create rich embeds for URLs also proxy images
  - [Leafwatch](../packages/workers/leafwatch/README.md) - Telemetry for Lenster
  - [Spaces](../packages/workers/spaces/README.md) - Interact with Huddle API for Spaces
