const readline = require('readline');
const {EventEmitter} = require('events');
const { emitWarning } = require('process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const questions = [
    "What is your name?",
    "What is favourite color?",
    "what is your preferred programming language?"
];


  
 const answers = [];
const askQuestionAndCollectAnswers = (questions) => {
   
     const emitter = new EventEmitter();

       emitter.on("answer", (data) => {
        console.log("Event received:", data);
    });
    const askNextQuestion = (questionedAnswered) => {
        console.log('questionedAnswered ====>>> ', questionedAnswered);

       
        emitter.emit("answer" , questionedAnswered)
        answers.push(questionedAnswered)

        console.log('answers just after asking quest =====>>> ', answers);
        
        if(answers.length < questions.length) {
            rl.question(questions[answers.length], askNextQuestion)
        } else {
            console.log('answers collected ====>>> ', answers);
            rl.close();
        }
    }
    rl.question(questions[answers.length], askNextQuestion )

    return emitter;
}

 askQuestionAndCollectAnswers(questions)




