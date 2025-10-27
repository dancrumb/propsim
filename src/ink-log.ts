export const inkLog = (message: string) => {
  process.stderr.write(`${message}\n`);
};
