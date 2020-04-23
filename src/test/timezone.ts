// 目标时区，东9区
let targetTimezone = 8
// 当前时区与中时区时差，以min为维度
let _dif = new Date().getTimezoneOffset()
// 本地时区时间 + 时差  = 中时区时间
// 目标时区时间 + 时差 = 中时区时间
// 目标时区时间 = 本地时区时间 + 本地时区时差 - 目标时区时差
// 东9区时间
let east8time = new Date().getTime() + _dif * 60 * 1000 - (targetTimezone * 60 * 60 * 1000)
let v = new Date(east8time)
v = new Date('2019-07-01')
console.log(v)