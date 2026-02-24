# @vaos/sdk

Runtime SDK that wires `@vaos/dak-core` services into application code.

## Scope

- `createDakRuntime(input)` factory
- typed handles for:
  - `runTick`
  - `processRunnableStreams`
  - `inspectStream`
  - direct service access (`ledger`, `leaseManager`, `tickEngine`, `introspection`)

## Install

```bash
npm install @vaos/sdk
```

## Build

```bash
npm run build
```

## License

MIT
