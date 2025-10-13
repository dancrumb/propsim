import { Operation } from "../../src/Operation";

export const runOperation = async (operation: Operation) => {
  operation.fetchSrcOperand();
  operation.fetchDstOperand();
  await operation.performOperation();
  operation.storeResult();
};
