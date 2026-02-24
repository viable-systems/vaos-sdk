import {
  AutonomyIntrospectionService,
  AutonomyLedgerService,
  AutonomyLeaseManager,
  AutonomyTickEngine,
  type AutonomyRepository,
  type AutonomyTickEngineOptions
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
