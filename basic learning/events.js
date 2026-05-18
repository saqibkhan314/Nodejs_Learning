const events = require('events');

const emitter = new events.EventEmitter();

emitter.on("customEvents" , (msg, dest) => {
    console.log('message ====>>>> ', msg , ' from ===>>> ', dest);
    
})

// emitter.emit("customEvents" , 'hello world', 'computer');
// emitter.emit("customEvents", 'saqib khan', 'user');

// now taking input from the terminal

process.stdin.on('data', (data) => {
    console.log('data ====>>> ', data.toString().trim());

    const input = data.toString().trim();

    if(input === 'exit') {
        emitter.emit("customEvents", "Goodbye", "user typed exit")
        process.exit()
    }
    
    emitter.emit('customEvents', input, "terminal")
})