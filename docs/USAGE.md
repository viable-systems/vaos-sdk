# Usage

```ts
import { createInMemoryDakRuntime, runTickWithReceipt } from '@vaos/sdk'

const runtime = createInMemoryDakRuntime()

runtime.repository.createStream({
  id: 'stream-1',
  workflow_type: 'factory',
  owner_user_id: 'user-1'
})

const execution = await runTickWithReceipt({
  runtime,
  streamId: 'stream-1',
  tickId: 'tick-1'
})
```
