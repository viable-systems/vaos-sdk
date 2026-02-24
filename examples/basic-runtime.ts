import { createInMemoryDakRuntime } from '../src'

async function main() {
  const runtime = createInMemoryDakRuntime({
    tickDelayMs: 0,
    clock: () => new Date('2026-02-24T00:00:00.000Z')
  })

  runtime.repository.createStream({
    id: 'example-stream',
    workflow_type: 'factory',
    owner_user_id: 'example-user',
    status: 'pending',
    current_state: { phase: 'ideas' },
    next_tick_at: '2026-02-24T00:00:00.000Z'
  })

  const result = await runtime.runTick({ streamId: 'example-stream', tickId: 'example-tick-1' })
  console.log(JSON.stringify(result, null, 2))
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
