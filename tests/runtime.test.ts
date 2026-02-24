import { describe, expect, it } from 'vitest'

import { createInMemoryDakRuntime, runTickWithReceipt } from '../src'

describe('sdk runtime', () => {
  it('creates an in-memory runtime and executes a deterministic tick', async () => {
    const runtime = createInMemoryDakRuntime({
      workerId: 'sdk-worker',
      tickDelayMs: 0,
      clock: () => new Date('2026-02-24T00:00:00.000Z')
    })

    runtime.repository.createStream({
      id: 'sdk-stream-1',
      workflow_type: 'factory',
      owner_user_id: 'user-1',
      status: 'pending',
      current_state: { phase: 'ideas' },
      next_tick_at: '2026-02-24T00:00:00.000Z'
    })

    const execution = await runTickWithReceipt({
      runtime,
      streamId: 'sdk-stream-1',
      tickId: 'sdk-tick-1',
      signingSecret: 'sdk-secret'
    })

    expect(execution.result.outcome).toBe('processed')
    expect(execution.receipt.stream_id).toBe('sdk-stream-1')
    expect(execution.receipt.signature).toBeTruthy()
  })
})
