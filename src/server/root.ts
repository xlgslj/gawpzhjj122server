import * as dataParser from './dataParser'
import * as modelhandle from './modelhandle'
import * as dateFormat from './dateFormat'
export function run () {
    dataParser.run()
    modelhandle.run()
    dateFormat.run()
}