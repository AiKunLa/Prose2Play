export interface DomainErrorOptions {
  readonly details?: Record<string, unknown>;
}

export class DomainError extends Error {
  public readonly code: string;
  public readonly details?: Readonly<Record<string, unknown>>;

  public constructor(message: string, code: string, options: DomainErrorOptions = {}) {
    super(message);

    this.name = new.target.name;
    this.code = code;
    this.details = options.details === undefined ? undefined : Object.freeze({ ...options.details });
  }
}

export class DomainValidationError extends DomainError {}

export class AdaptationJobTransitionError extends DomainError {
  public constructor(from: string, to: string) {
    super(`Transition from "${from}" to "${to}" is not allowed.`, "ADAPTATION_JOB_TRANSITION_NOT_ALLOWED", {
      details: {
        from,
        to,
      },
    });
  }
}
