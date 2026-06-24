//readline is used to take input from the terminal in easy way rather then using the process.stdin.on("data")

/*
const rl = readline.createInterface({
    
}) ====>>>> creates a connection between node js and terminal

*/




const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

rl.question('what is your favourite food?', (ans) => {
    console.log('you ans is: ', ans.trim());
  rl.close()
    
})
