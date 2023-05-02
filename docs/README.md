# Documentations

- [Development](development.md)
- [Tech Stack](tech-stack.md)
- [Internationalization](internationalization.md)
- [Environment](environment.md)
- [Ports](ports.md)
- [DevOps](devops.md)
- [Monorepo](../apps/README.md)
- [Packages](../packages/README.md)
- [Scripts](../scripts/README.md)

## Cloudflare Workers

We use Cloudflare Workers to handle some of the heavy lifting for us. These workers are deployed to Cloudflare's edge network and are written in TypeScript. They are located in the `packages/workers` directory.

- [STS Token Generator](../packages/workers/sts-generator/README.md)
- [Metadata](../packages/workers/metadata/README.md)
- [Freshdesk](../packages/workers/freshdesk/README.md)
- [Prerender](../packages/workers/prerender/README.md)
