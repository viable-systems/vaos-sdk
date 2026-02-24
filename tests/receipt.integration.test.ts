import { describe, expect, it } from 'vitest'

import { createInMemoryDakRuntime, runTickWithReceipt, verifyStreamReceipt } from '../src'

describe('sdk receipt integration', () => {
  it('verifies generated receipts against repository state', async () => {
    const runtime = createInMemoryDakRuntime({
      workerId: 'sdk-worker-2',
      tickDelayMs: 0,
      clock: () => new Date('2026-02-24T00:01:00.000Z')
    })

    runtime.repository.createStream({
      id: 'sdk-stream-2',
      workflow_type: 'factory',
      owner_user_id: 'user-2',
      status: 'pending',
      current_state: { phase: 'ideas' },
      next_tick_at: '2026-02-24T00:01:00.000Z'
    })

    const execution = await runTickWithReceipt({
      runtime,
      streamId: 'sdk-stream-2',
      tickId: 'sdk-tick-2',
      signingSecret: 'sdk-secret-2'
    })

    const stream = await runtime.repository.getStream('sdk-stream-2')
    if (!stream) {
      throw new Error('missing stream')
    }

    const verification = await verifyStreamReceipt({
      runtime,
      stream,
      tickId: 'sdk-tick-2',
      receipt: execution.receipt,
      signingSecret: 'sdk-secret-2'
    })

    expect(verification.valid).toBe(true)
  })
})
