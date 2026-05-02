# Retry

## Overview

Allows retrying an arbitrary operation.

```ts
const data = await retry({
  attempts: 5,
  delay: n => n * n * 100, // Interpreted as milliseconds
  fn: () => {
    const res = await fetch('https://flaky-host.com/api/data');
    if (res.status >= 500) throw Error('host flaked')[mod]({ retry: true });
    
    const json = await res.json();
    if (json === `we're experiencing problems sorry`)
      throw Error('unreliable host flaked')[mod]({ retry: true });
    
    return json;
  },
  retryable: err => !!err.retry
});
```