import { Operation } from "../../src/Operation";

export const runOperation = async (operation: Operation) => {
  operation.fetchDstOperand();
  operation.fetchSrcOperand();
  await operation.performOperation();
  operation.storeResult();
};
