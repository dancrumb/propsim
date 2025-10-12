export interface Operation {
  readonly hubOperation: boolean;

  fetchDstOperand(): void;
  fetchSrcOperand(): void;
  performOperation(): Promise<void>;
  storeResult(): void;

  getNextExpectedPC(): number;

  readonly src: number;
  readonly dst: number;
  readonly res: number;
}
