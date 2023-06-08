# Exposed Ports

The following ports are exposed by the repository

| Port | Description                | Local endpoint        | Production endpoint                | Description                                   |
| ---- | -------------------------- | --------------------- | ---------------------------------- | --------------------------------------------- |
| 4783 | Web app                    | http://localhost:4783 | https://lenster.xyz                | Lenster web app                               |
| 4784 | Prerender app              | http://localhost:4784 | https://prerender.lenster.xyz      | Prerender app for SEO only for bots           |
| 8082 | STS token generator worker | http://localhost:8082 | https://sts.lenster.xyz            | Generate S3 Compatible STS token in 4Everland |
| 8083 | Metadata worker            | http://localhost:8083 | https://metadata.lenster.xyz       | Create metadata on Arweave via Bundlr         |
| 8084 | Freshdesk worker           | http://localhost:8084 | https://freshdesk.lenster.xyz      | Create Freshdesk tickets                      |
| 8085 | Snapshot relay worker      | http://localhost:8085 | https://snapshot-relay.lenster.xyz | Relayer for Snapshot for Polls and Proposals  |
| 8086 | ENS resolver worker        | http://localhost:8086 | https://ens-resolver.lenster.xyz   | Resolve Ethereum address to ENS names         |
| 8087 | Oembed worker              | http://localhost:8087 | https://oembed.lenster.xyz         | Create rich embeds for URLs also proxy images |
| 8088 | Leafwatch worker           | http://localhost:8088 | https://leafwatch.lenster.xyz      | Telemetry for Lenster                         |
| 8089 | Spaces worker              | http://localhost:8089 | https://spaces.lenster.xyz         | Interact with Huddle API for Spaces           |
