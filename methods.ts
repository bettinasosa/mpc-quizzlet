const zkClient = require("@partisiablockchain/zk-client")

// Log all methods and properties of the module
console.log("Methods and properties of zkClient:")
console.log(Object.getOwnPropertyNames(zkClient.prototype || zkClient))

// If zkClient contains nested objects or classes, you can recursively explore them
console.log("\nKeys in zkClient:")
for (let key of Object.keys(zkClient)) {
  console.log(`${key}:`, typeof zkClient[key])
}
