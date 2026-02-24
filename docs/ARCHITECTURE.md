# SDK Architecture

`@vaos/sdk` composes `@vaos/dak-core` services into runtime handles used by application code.

## Responsibilities

- runtime factory creation
- consistent wiring of ledger/lease/tick/introspection services
- in-memory runtime shortcut for local tests and examples
- proof-receipt convenience wrappers
