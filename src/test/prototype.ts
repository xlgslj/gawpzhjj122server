let person = function (name) {
    this.name =name
}

let p1 = new person('lj')
let p2 = {
    kk: 1
}


let db = {
    model: function () {
        function person (name) {
            this.name = name
        }
        person.prototype.save = function() {
            console.log('ok')
        }
        return function (name) {
            return new person(name)
        }
    }
}
let model = db.model();
let ent= model('lj')
ent.save()
console.log(ent.__proto__)
console.log(ent.__proto__.constructor.prototype)

console.log(ent.__proto__ === ent.__proto__.constructor.prototype) 