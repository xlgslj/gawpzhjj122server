import * as AsyncLock from 'async-lock'
let lock = new AsyncLock();
export {lock}