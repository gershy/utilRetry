import '@gershy/clearing';
import defaultRetryable from './defaultRetryable.ts';

export type RetryArgs = {
  attempts: number,
  delay?: (attempt: number) => number,
  retryable?: (err: any) => boolean,
  fn: (attempt: 1 | 2 | 3 | number) => any,
};
export default async <Args extends RetryArgs>(args: Args): Promise<{ val: Awaited<ReturnType<Args['fn']>>, errs: any[] }> => {
  
  // Note that by default, errors are considered retryable if they have a true-ish "retry" property
  
  const { attempts, delay = null, retryable = defaultRetryable, fn } = args;
  
  const errs: any[] = [];
  while (true) {
    
    try {
      
      return { val: await fn(errs.length), errs };
      
    } catch(err) {
      
      if (!retryable(err)) throw err;
      
      errs.push(err);
      if (errs.length >= attempts) throw Error('retries exhausted')[clearing.mod]({ cause: errs[0], errs });
      
      if (delay) await new Promise(r => setTimeout(r, delay(errs.length)));
       
    }
    
  }
  
};