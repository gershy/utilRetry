import '@gershy/clearing';
import defaultRetryable from './defaultRetryable.ts';

export type RetryArgs<R> = {
  attempts: number,
  delayMs?: (attempt: 1 | 2 | 3 | number) => number, // Starts counting from `1`
  retry?: (err: any) => boolean,
  fn: (attempt: 1 | 2 | 3 | number) => R,
};
export default async <R>(args: RetryArgs<R>): Promise<{ val: Awaited<R>, errs: any[] }> => {
  
  // Note that by default, errors are considered retryable if they have a true-ish "retry" property
  
  const { attempts, delayMs = null, retry: retryable = defaultRetryable, fn } = args;
  
  const errs: any[] = [];
  while (true) {
    
    try { return { val: await fn(errs.length), errs }; } catch(err) {
      
      if (!retryable(err)) throw err;
      
      errs.push(err);
      if (errs.length >= attempts) throw Error('retries exhausted')[cl.mod]({ cause: errs[0], errs });
      
      if (delayMs) await new Promise(r => setTimeout(r, delayMs(errs.length)));
       
    }
    
  }
  
};