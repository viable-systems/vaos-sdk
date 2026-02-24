// src/index.ts
import {
  AutonomyIntrospectionService,
  AutonomyLedgerService,
  AutonomyLeaseManager,
  AutonomyTickEngine,
  InMemoryAutonomyRepository,
  buildDeterminismReceipt,
  verifyDeterminismReceipt
} from "@vaos/dak-core";
function createDakRuntime(input) {
  const ledger = new AutonomyLedgerService(input.repository);
  const leaseManager = new AutonomyLeaseManager(input.repository);
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
  });
  const introspection = new AutonomyIntrospectionService(input.repository);
  return {
    repository: input.repository,
    ledger,
    leaseManager,
    tickEngine,
    introspection,
    runTick: tickEngine.runTick.bind(tickEngine),
    processRunnableStreams: tickEngine.processRunnableStreams.bind(tickEngine),
    inspectStream: introspection.inspectStream.bind(introspection)
  };
}
function createInMemoryDakRuntime(input = {}) {
  const repository = new InMemoryAutonomyRepository();
  return createDakRuntime({
    ...input,
    repository
  });
}
async function runTickWithReceipt(input) {
  const result = await input.runtime.runTick({
    streamId: input.streamId,
    tickId: input.tickId
  });
  const stream = await input.runtime.repository.getStream(input.streamId);
  if (!stream) {
    throw new Error(`Stream not found for receipt: ${input.streamId}`);
  }
  const events = await input.runtime.repository.getEvents(input.streamId);
  const snapshot = await input.runtime.repository.getLatestSnapshot(input.streamId);
  const receiptInput = {
    stream,
    events,
    tickId: input.tickId,
    snapshot,
    engineVersion: input.engineVersion,
    signingSecret: input.signingSecret
  };
  return {
    result,
    receipt: buildDeterminismReceipt(receiptInput)
  };
}
async function verifyStreamReceipt(input) {
  const events = await input.runtime.repository.getEvents(input.stream.id);
  const snapshot = await input.runtime.repository.getLatestSnapshot(input.stream.id);
  return verifyDeterminismReceipt(input.receipt, {
    stream: input.stream,
    events,
    tickId: input.tickId,
    snapshot,
    signingSecret: input.signingSecret
  });
}
export {
  createDakRuntime,
  createInMemoryDakRuntime,
  runTickWithReceipt,
  verifyStreamReceipt
};
