let quizPageNo,quizId,quizQuestion,quizChoice,quizAnswer;
let userChoice,timer,countdown;
let answerArray = Array(quizData.length);
let correct,incorrect,incomplete;
const allowedTime = 20;


function beginQuiz(){
    quizId = 1;
    correct = 0;
    incorrect = 0;
    incomplete = 0;
    countdown=allowedTime;
    const {displayMinutes, displaySeconds} = toActualTime(countdown);
    document.getElementById('timer').textContent=`${displayMinutes}:${displaySeconds}`;
    loadQuiz(quizId);
    /*reset timer*/
    userChoice = Array(quizData.length).fill(-1);
    for(let i=0;i<quizData.length;i++){
        answerArray[i]=quizData[i].correctAnswer;
        //console.log(answerArray[i]);
    }
    //console.log(answerArray);

    displayContainer('quizPage');
    /*start timer*/
    startTimer();
    if(document.getElementById('next').textContent==="Finish Quiz"){
        document.getElementById('next').textContent="Next";
    }
}
function initQuiz(){
    quizId = 1;
    quizQuestion = quizData[0].question;
    quizChoice = quizData[0].choices;
    quizAnswer = quizData[0].correctAnswer;
}
function loadQuiz(id){
    /* clear radio buttons each time. will change later*/
    const allRadioBtn = document.querySelectorAll('input[name="quiz-choice"]');
    for(let i=0;i<allRadioBtn.length;i++){
        //console.log(allRadioBtn[i].checked);
        allRadioBtn[i].checked=false;
    }
    quizId = id;
    quizQuestion = quizData[quizId-1].question;
    quizCoice = quizData[quizId-1].choices;
    quizAnswer = quizData[quizId-1].correctAnswer;
    //console.log(quizQuestion+"\n"+quizCoice+"\n"+quizAnswer);
    document.getElementById("progress").style.width = "0%";
    
    document.getElementById('quizPosText').textContent = "Question "+quizId+" of "+quizData.length;

    document.getElementById("questionText").textContent = quizQuestion;
    for(let i=0;i<quizCoice.length;i++){
        //console.log(document.querySelectorAll('.choice-text')[i].textContent);
        document.querySelectorAll('.choice-text')[i].textContent = quizCoice[i];
    }
    // take the user choice
    for(let i=0;i<allRadioBtn.length;i++){
        //console.log("inside loop");
        document.getElementById("next").disabled=true;
        allRadioBtn[i].addEventListener("change",function(event){
            userChoice[quizId-1] = event.target.value;
            document.getElementById("next").disabled=false;
            //console.log(userChoice);
        });
    }

}
function displayContainer(container){
    const allActive = document.querySelectorAll('.activated');
    /*console.log(allActive);*/
    for(let i=0;i<allActive.length;i++){
        allActive[i].classList.remove('activated');
        //console.log(allActive[i].classList);
    }
    //console.log(allActive);
    document.getElementById(container).classList.add('activated');
}
function nextPage(){
    if(document.getElementById('previous').disabled){
        document.getElementById('previous').disabled=false;
    }
    if(quizId<quizData.length){
        //console.log(quizId+"\n"+quizData.length);
        quizId++;
        loadQuiz(quizId);
        changeBar(quizId);
        if((quizId)==quizData.length){
            //console.log("HIT == "+quizId);
            document.getElementById('next').textContent="Finish Quiz";
        }
    }
    else{
        clearInterval(timer);
        quizFinished();
    }
}
function prevPage(){
    if(document.getElementById('next').textContent==="Finish Quiz"){
        document.getElementById('next').textContent="Next";
    }
    //console.log(quizId+"\n"+quizData.length);
        
    if(quizId==1){
        document.getElementById('previous').disabled=true;
        loadQuiz(quizId);
        changeBar(quizId);
    }
    else{
        quizId--;
        loadQuiz(quizId);
        changeBar(quizId);
    }
}
function changeBar(quizId){
    let currentQuiz = quizId -1;
    progressStat = document.getElementById("progress");
    progressStat.style.width = ((currentQuiz/quizData.length)*100).toFixed(2) + "%";
    // console.log(((currentQuiz/quizData.length)*100).toFixed(2) + "%");
    // console.log(currentQuiz);
}
function quizFinished(){
    displayContainer('reviewPage'); // this function can be called from "finish" button or time end.
    calResult();
}
function calResult(){
    for(let i=0;i<answerArray.length;i++){
        if(userChoice[i]==-1){
            incomplete++;
        }
        else if(userChoice[i] == answerArray[i]){
            correct++;
        }
        else{
            incorrect++;
        }
    }
     console.log("correct: "+correct+" incorrect: "+incorrect+" incomplete: "+incomplete);
     console.log(userChoice+"\t"+answerArray);
    
    
    document.getElementById('revStatCorrect').textContent=correct+" Correct";
    document.getElementById('revStatIncorrect').textContent=incorrect+" Incorrect";
    document.getElementById('revStatUnattempted').textContent=incomplete+" Unattempted";

    document.getElementById('scoreTotal').textContent=correct+"/"+answerArray.length;
    document.getElementById('percentage').textContent=((correct/answerArray.length)*100).toFixed(2)+"%";
    const {displayMinutes, displaySeconds} = toActualTime(allowedTime-countdown);
    document.getElementById('timeSpent').textContent=`${displayMinutes}:${displaySeconds}`;

    document.getElementById('statCorrect').textContent=correct;
    document.getElementById('statIncorrect').textContent=incorrect;
    document.getElementById('statIncomplete').textContent=incomplete;

    buildReview();
    
}
function buildReview(){
    let totalRowString = "";
// ${userChoice[i]== -1 ? "Unattempted" : quizData[i].correctAnswer == userChoice[i] ? "Correct":"Incorrect"}
    for(let i=0;i<quizData.length;i++){
        const icoBG = userChoice[i] == -1 ? "sldGray" : userChoice[i] == quizData[i].correctAnswer ? "sldGreen":"sldRed";
        const txtClr = userChoice[i] == -1 ? "txtGray" : userChoice[i] == quizData[i].correctAnswer ? "txtGreen":"txtRed";
        const stClr = userChoice[i] == -1 ? "stGray" : userChoice[i] == quizData[i].correctAnswer ? "stGreen":"stRed";
        const stTxt = userChoice[i]== -1 ? "Unattempted" : quizData[i].correctAnswer == userChoice[i] ? "Correct":"Incorrect"
        //console.log(icoBG);
        totalRowString += `
            <div class="revRow" id="revRow">
                <p class="revQaNumber ${icoBG}">${i+1}</p>
                <div class="revRowQa" id="revRowQa">
                    <p class="revRowQ" id="revRowQ">${quizData[i].question}</p>
                    <p class="revRowA">Your answer: <span class="revRowA ${txtClr}" id="revRowAns">${userChoice[i] == -1 ? "-":quizData[i].choices[userChoice[i]]}</span></p>
                    <p class="revRowA">Correct Answer: <span id="revRowCorAns">${quizData[i].choices[quizData[i].correctAnswer]}</span></p>
                </div>
                <div class="revRowRightStatDiv ${stClr}">
                    <p class="revRowA ${stClr}" id="revRowRightStatText">${stTxt}</p>
                </div>
            </div>

            `
    }
    document.getElementById('revBody').innerHTML= totalRowString;
   // console.log(totalRowString);
}
function startTimer(){
    clearInterval(timer);

    //document.getElementById('timer').textContent=countdown;

    timer=setInterval(function(){
        countdown--;

        const { displayMinutes, displaySeconds } = toActualTime(countdown); // object destructuring
        
        document.getElementById('timer').textContent=`${displayMinutes}:${displaySeconds}`;

        //document.getElementById('timer').textContent=countdown;
            if(countdown==0){
                clearInterval(timer);
                document.getElementById('timer').textContent="Time is up";
                quizFinished();
            }
        }
        ,1000);
}
function toActualTime(totalSeconds){
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const displayMinutes = String(minutes).padStart(2, '0');
    const displaySeconds = String(seconds).padStart(2, '0');

    return { displayMinutes, displaySeconds };
}
// function triggerConfetti() {
//     document.getElementById('conftettiTrigger').disabled=true;
//     const quizBox = document.querySelector('.leftdiv');
//     const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#eccc68', '#9b59b6'];

//     if (!quizBox) return;

//     for (let i = 0; i < 50; i++) {
//         createSingleConfetti(quizBox, colors);
//     }
// }

// function createSingleConfetti(quizBox, colors) {
//     const piece = document.createElement('div');
//     piece.classList.add('confetti-piece');
//     quizBox.appendChild(piece);

//     let currentX = Math.random() * quizBox.clientWidth; 
//     let currentY = -(Math.random() * 100 + 15); 
//     let waveTime = Math.random() * 100; 
//     const fallSpeed = Math.random() * 3 + 2;
    
//     piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

//     const animationTimer = setInterval(function() {
//         currentY += fallSpeed; 
//         waveTime += 0.08; 
//         let zigzag = Math.sin(waveTime) * 2;
//         currentX += zigzag;

//         piece.style.top = currentY + 'px';
//         piece.style.left = currentX + 'px';

//         if (currentY >= quizBox.clientHeight) {
//             clearInterval(animationTimer); 
//             piece.remove();                 
//         }
       
//     }, 15);
   
// }

function triggerConfetti(){
    const container = document.querySelector('.leftdiv');

    for(let i=0;i<100;i++){
        const confetti = document.createElement('div');
        confetti.classList.add("confetti");

        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 2 + 's'; // dont fall at the same time
        confetti.style.animationDuration = (Math.random() * 2 + 2.5) + 's'; // different speed

        container.appendChild(confetti);
            setTimeout(() => {
            confetti.remove();
        }, 5000); 
    }

    

}