function copyToModel (src, model) {
    for (let k in model) {
        let v = src[k.toUpperCase()] || src[k.toLowerCase()] || null
        if (v) {
            model[k] = v
        } else {
            delete model[k]
        }
    }
    return model
}

export function run () {
    
    Object.defineProperty(Object.prototype, "copyToModel", {
        enumerable: false,//描述属性是否会出现在for in 或者 Object.keys()的遍历中
        writable: true,
        configurable: true,
        value: function(model){
           return copyToModel(this, model)
        }
    })
}