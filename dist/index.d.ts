import { AutonomyRepository, AutonomyTickEngineOptions, AutonomyLedgerService, AutonomyLeaseManager, AutonomyTickEngine, AutonomyIntrospectionService, InMemoryAutonomyRepository, DeterminismReceipt, AutonomyStream, VerifyDeterminismReceiptResult } from '@vaos/dak-core';

interface CreateDakRuntimeInput {
    repository: AutonomyRepository;
    workerId?: string;
    leaseTtlMs?: number;
    tickBudgetMs?: number;
    tickDelayMs?: number;
    snapshotInterval?: number;
    maxAdaptationAttempts?: number;
    transitionExecutor?: AutonomyTickEngineOptions['transitionExecutor'];
    clock?: () => Date;
}
interface DakRuntime {
    repository: AutonomyRepository;
    ledger: AutonomyLedgerService;
    leaseManager: AutonomyLeaseManager;
    tickEngine: AutonomyTickEngine;
    introspection: AutonomyIntrospectionService;
    runTick: AutonomyTickEngine['runTick'];
    processRunnableStreams: AutonomyTickEngine['processRunnableStreams'];
    inspectStream: AutonomyIntrospectionService['inspectStream'];
}
interface InMemoryDakRuntime extends Omit<DakRuntime, 'repository'> {
    repository: InMemoryAutonomyRepository;
}
interface RunTickWithReceiptInput {
    runtime: DakRuntime;
    streamId: string;
    tickId: string;
    signingSecret?: string;
    engineVersion?: string;
}
interface RunTickWithReceiptResult {
    result: Awaited<ReturnType<DakRuntime['runTick']>>;
    receipt: DeterminismReceipt;
}
interface VerifyStreamReceiptInput {
    runtime: DakRuntime;
    stream: AutonomyStream;
    tickId: string;
    receipt: DeterminismReceipt;
    signingSecret?: string;
}
declare function createDakRuntime(input: CreateDakRuntimeInput): DakRuntime;
declare function createInMemoryDakRuntime(input?: Omit<CreateDakRuntimeInput, 'repository'>): InMemoryDakRuntime;
declare function runTickWithReceipt(input: RunTickWithReceiptInput): Promise<RunTickWithReceiptResult>;
declare function verifyStreamReceipt(input: VerifyStreamReceiptInput): Promise<VerifyDeterminismReceiptResult>;

export { type CreateDakRuntimeInput, type DakRuntime, type InMemoryDakRuntime, type RunTickWithReceiptInput, type RunTickWithReceiptResult, type VerifyStreamReceiptInput, createDakRuntime, createInMemoryDakRuntime, runTickWithReceipt, verifyStreamReceipt };
