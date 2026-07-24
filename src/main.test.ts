import { assertEqual, testRunner } from '../build/utils.test.ts';
import retry from './main.ts';
import { entry } from '@gershy/entry';

const codec = {
  type: 'rec',
  props: {
    
    reg:    { type: 'str', map: (str: string) => new RegExp(str) },
    effort: { type: 'enum', opts: [ 0, 1, 2, 3, 4, 5, 6 ] },
    
  }
} as const;

const mod: typeof cl.mod = cl.mod;

entry({ name: 'utilRetry', codec, inp: { reg: '^', effort: 0 }, fn: async (logger, { reg, effort, ...inp }) => {
  
  // Type testing
  (async () => {
    
    type Enforce<Provided, Expected extends Provided> = { provided: Provided, expected: Expected };
    
    type Tests = {
      1: Enforce<{ x: 'y' }, { x: 'y' }>,
    };
    if (0) ((v?: Tests) => void 0)();
    
  })();
  
  await testRunner({ logger, reg, effort, inp, cases: [
    
    { name: 'basic success', fn: async () => {
      
      const result = await retry({
        
        attempts: 100,
        delay: n => 0,
        fn: async () => 'hello'
        
      });
      
      assertEqual(result, { val: 'hello', errs: [] });
      
    }},
    { name: 'basic retry', fn: async () => {
      
      await retry({
        
        attempts: 3,
        delay: n => 0,
        fn: async n => { throw Error(`ow`)[mod]({ n, retry: true }); }
        
      }).then(
        
        () => { throw Error('should have failed'); },
        err => {
          assertEqual(err, Error('retries exhausted')[mod]({
            cause: Error('ow')[mod]({ n: 0, retry: true }),
            errs: [
              Error('ow')[mod]({ n: 0, retry: true }),
              Error('ow')[mod]({ n: 1, retry: true }),
              Error('ow')[mod]({ n: 2, retry: true })
            ]
          }))
        }
        
      );
      
    }},
    { name: 'basic prevented retry', fn: async () => {
      
      await retry({
        
        attempts: 3,
        delay: n => 0,
        fn: async n => { throw Error(`ow`)[mod]({ n /* retry: true */ }); }
        
      }).then(
        
        () => { throw Error('should have failed'); },
        err => {
          assertEqual(err, Error('ow')[mod]({ n: 0 }))
        }
        
      );
      
    }},
    { name: 'retry to success', fn: async () => {
      
      const result = await retry({
        
        attempts: 10,
        delay: n => 0,
        fn: async n => {
          if (n !== 9) throw Error(`ow`)[mod]({ n, retry: true });
          return 'yay'
        }
        
      });
      
      assertEqual(result, {
        val: 'yay',
        errs: [
          Error('ow')[mod]({ n: 0, retry: true }),
          Error('ow')[mod]({ n: 1, retry: true }),
          Error('ow')[mod]({ n: 2, retry: true }),
          Error('ow')[mod]({ n: 3, retry: true }),
          Error('ow')[mod]({ n: 4, retry: true }),
          Error('ow')[mod]({ n: 5, retry: true }),
          Error('ow')[mod]({ n: 6, retry: true }),
          Error('ow')[mod]({ n: 7, retry: true }),
          Error('ow')[mod]({ n: 8, retry: true }),
        ]
      });
      
    }}
    
  ]});
  
}});

