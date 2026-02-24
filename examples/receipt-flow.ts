import { createInMemoryDakRuntime, runTickWithReceipt } from '../src'

async function main() {
  const runtime = createInMemoryDakRuntime({
    tickDelayMs: 0,
    clock: () => new Date('2026-02-24T00:10:00.000Z')
  })

  runtime.repository.createStream({
    id: 'receipt-stream',
    workflow_type: 'factory',
    owner_user_id: 'example-user',
    status: 'pending',
    current_state: { phase: 'ideas' },
    next_tick_at: '2026-02-24T00:10:00.000Z'
  })

  const execution = await runTickWithReceipt({
    runtime,
    streamId: 'receipt-stream',
    tickId: 'receipt-tick-1',
    signingSecret: 'example-secret'
  })

  console.log(JSON.stringify(execution, null, 2))
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
