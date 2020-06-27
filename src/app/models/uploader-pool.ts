type promiseGeneratorType = () => Promise<void>;

export class UploaderPool {
  private promiseGeneratorArray: Array<promiseGeneratorType> = [];
  private executingAmount = 0;

  /**
   * This object is an _executor_ of an array of promises. It is instantiated specifying a number of
   * the maximum concurrent executions we want to allow. New _promiseGenerators_ can be added with the
   * `.add` method. Once all promises have been added, the method `.execute` can be used to execute
   * the promises (at most `maxExecutions` promises at a time).
   *
   * The idea is that as soon as a promise is generated by a given promiseGenerator, it will start immediately
   * executing.
   *
   * Note that promises are not _generated_ immediately, rather they're generated immediately before they're
   * supposed to be executed by the pool. So any temporal sensitive state building of the promise should be
   * done in the generator (eg, setting an up-to-date JWT)
   */
  constructor(private maxExecutions: number) {}

  /**
   * Queues a promise generator to be executed. They're executed in the order in which they were queued with this method.
   *
   * @param promiseGenerator A function without params that returns the promise for
   * which we should wait
   */
  public add(promiseGenerator: promiseGeneratorType) {
    this.promiseGeneratorArray.push(promiseGenerator);
  }

  /**
   * Method that waits for one promise to finish and registers when this
   * has happened.
   *
   * @param fnc
   */
  private async manageExecutionOfOne(fnc: promiseGeneratorType) {
    let prom = fnc();
    await prom;
    this.executingAmount -= 1;
  }

  /**
   * Executes all the _promiseGenerators_ which have been added to the pool.
   * It will ensure that at most `maxExecutions` promises are being executed
   * at the same time.
   *
   * Once the execution is finished the pool will clear itself of the added
   * generators.
   *
   * Promises are executed in the order in which they were queued with `.add`.
   */
  public async execute() {
    for (let pg of this.promiseGeneratorArray) {
      await new Promise(async res => {
        while (this.executingAmount >= this.maxExecutions) {
          await new Promise(r => setTimeout(r, 200));
        }
        res();
      });

      this.executingAmount += 1;
      this.manageExecutionOfOne(pg);
    }

    // finally, clear current generator array
    this.promiseGeneratorArray = [];
  }
}
