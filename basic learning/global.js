console.log(__dirname); // this will print the dir name name E:\Backend\Best Tutorial\basic learning
console.log(__filename); //this will print file name E:\Backend\Best Tutorial\basic learning\global.js


const path = require("path");

console.log('the file name is ', path.basename(__filename)); //the file name is  global.js


console.log(process.pid);

