const questions = [
    "What is your name?",
    "What is favourite color?",
    "what is your preferred programming language?"
];

//process.stdout.write() ===>>> is used to write the output directly in the terminal

// differnece between console.log and process.stdout.write() is that console.log adds new line automatically but process.stdout.write() does'nt add new line 

// this below funct ask is for asking all the questions

const ask = (i = 0) => {
    console.log('process.stdout.write() ====>>> ',  process.stdout.write(`\n\n ${questions[i]}`)); //process.stdout.write() ==>> it returns true if something inside the () else error
    
    process.stdout.write(`\n\n ${questions[i]}`);
    process.stdout.write(` > `);
}

ask();


// process.stdin.on() =====>>>> used to listen for input from the keyboard 

//syntax ===>>> process.stdin.on("event", callBackFunct)

const answers  = [];
process.stdin.on("data", (data) => {
    console.log('data ===>> ', data); // raw binary data ===>>> <Buffer 6b 64 73 66 6d 6b 20 64 6d 6b 64 6d 76 0d 0a> 
    
    answers.push(data.toString().trim());

    console.log();
    

    console.log('answers.length ===>>> ', answers.length);

    console.log('answers ====>>>>> ',answers);
    
    
    // process.exit()

    if(answers.length < questions.length ) ask(answers.length);
     else process.exit()
})


// this event listerner is handling during the exit

process.on('exit', () => {
    const [ name, color, lang] = answers;
    console.log(name);
    console.log(color);
    console.log(lang);
    
    
    
})

// console.log('answers ====>>>> ', answers);
