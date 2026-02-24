import {
  AutonomyIntrospectionService,
  AutonomyLedgerService,
  AutonomyLeaseManager,
  AutonomyTickEngine,
  InMemoryAutonomyRepository,
  buildDeterminismReceipt,
  verifyDeterminismReceipt,
  type AutonomyRepository,
  type AutonomyStream,
  type AutonomyTickEngineOptions,
  type BuildDeterminismReceiptInput,
  type DeterminismReceipt,
  type VerifyDeterminismReceiptResult
} from '@vaos/dak-core'

export interface CreateDakRuntimeInput {
  repository: AutonomyRepository
  workerId?: string
  leaseTtlMs?: number
  tickBudgetMs?: number
  tickDelayMs?: number
  snapshotInterval?: number
  maxAdaptationAttempts?: number
  transitionExecutor?: AutonomyTickEngineOptions['transitionExecutor']
  clock?: () => Date
}

export interface DakRuntime {
  repository: AutonomyRepository
  ledger: AutonomyLedgerService
  leaseManager: AutonomyLeaseManager
  tickEngine: AutonomyTickEngine
  introspection: AutonomyIntrospectionService
  runTick: AutonomyTickEngine['runTick']
  processRunnableStreams: AutonomyTickEngine['processRunnableStreams']
  inspectStream: AutonomyIntrospectionService['inspectStream']
}

export interface InMemoryDakRuntime extends Omit<DakRuntime, 'repository'> {
  repository: InMemoryAutonomyRepository
}

export interface RunTickWithReceiptInput {
  runtime: DakRuntime
  streamId: string
  tickId: string
  signingSecret?: string
  engineVersion?: string
}

export interface RunTickWithReceiptResult {
  result: Awaited<ReturnType<DakRuntime['runTick']>>
  receipt: DeterminismReceipt
}

export interface VerifyStreamReceiptInput {
  runtime: DakRuntime
  stream: AutonomyStream
  tickId: string
  receipt: DeterminismReceipt
  signingSecret?: string
}

export function createDakRuntime(input: CreateDakRuntimeInput): DakRuntime {
  const ledger = new AutonomyLedgerService(input.repository)
  const leaseManager = new AutonomyLeaseManager(input.repository)
  const tickEngine = new AutonomyTickEngine({
    repository: input.repository,
    ledger,
    leaseManager,
    workerId: input.workerId,
    leaseTtlMs: input.leaseTtlMs,
    tickBudgetMs: input.tickBudgetMs,
    tickDelayMs: input.tickDelayMs,
    snapshotInterval: input.snapshotInterval,
    maxAdaptationAttempts: input.maxAdaptationAttempts,
    transitionExecutor: input.transitionExecutor,
    clock: input.clock
  })
  const introspection = new AutonomyIntrospectionService(input.repository)

  return {
    repository: input.repository,
    ledger,
    leaseManager,
    tickEngine,
    introspection,
    runTick: tickEngine.runTick.bind(tickEngine),
    processRunnableStreams: tickEngine.processRunnableStreams.bind(tickEngine),
    inspectStream: introspection.inspectStream.bind(introspection)
  }
}

export function createInMemoryDakRuntime(input: Omit<CreateDakRuntimeInput, 'repository'> = {}): InMemoryDakRuntime {
  const repository = new InMemoryAutonomyRepository()
  return createDakRuntime({
    ...input,
    repository
  }) as InMemoryDakRuntime
}

export async function runTickWithReceipt(input: RunTickWithReceiptInput): Promise<RunTickWithReceiptResult> {
  const result = await input.runtime.runTick({
    streamId: input.streamId,
    tickId: input.tickId
  })

  const stream = await input.runtime.repository.getStream(input.streamId)
  if (!stream) {
    throw new Error(`Stream not found for receipt: ${input.streamId}`)
  }

  const events = await input.runtime.repository.getEvents(input.streamId)
  const snapshot = await input.runtime.repository.getLatestSnapshot(input.streamId)

  const receiptInput: BuildDeterminismReceiptInput = {
    stream,
    events,
    tickId: input.tickId,
    snapshot,
    engineVersion: input.engineVersion,
    signingSecret: input.signingSecret
  }

  return {
    result,
    receipt: buildDeterminismReceipt(receiptInput)
  }
}

export async function verifyStreamReceipt(input: VerifyStreamReceiptInput): Promise<VerifyDeterminismReceiptResult> {
  const events = await input.runtime.repository.getEvents(input.stream.id)
  const snapshot = await input.runtime.repository.getLatestSnapshot(input.stream.id)

  return verifyDeterminismReceipt(input.receipt, {
    stream: input.stream,
    events,
    tickId: input.tickId,
    snapshot,
    signingSecret: input.signingSecret
  })
}
