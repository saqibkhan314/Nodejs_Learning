// setTimeout( (r) => {
//     console.log('done');
// },3000)


const waitTime = 3000;
const waitInterval = 500;
const timerFinished  = () => {
    console.log('done')
};


setTimeout(timerFinished,waitTime)
