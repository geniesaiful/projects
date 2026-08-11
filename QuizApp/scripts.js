let quizPageNo,quizId,quizQuestion,quizChoice,quizAnswer;

function beginQuiz(){
    quizId = 1;
    loadQuiz(quizId);
    /*reset timer*/
    displayContainer('quizPage');
    /*start timer*/
}
function initQuiz(){
    quizId = 1;
    quizQuestion = quizData[0].question;
    quizChoice = quizData[0].choices;
    quizAnswer = quizData[0].correctAnswer;
}
function loadQuiz(id){
    quizId = id;
    quizQuestion = quizData[quizId-1].question;
    quizCoice = quizData[quizId-1].choices;
    quizAnswer = quizData[quizId-1].correctAnswer;
    console.log(quizQuestion+"\n"+quizCoice+"\n"+quizAnswer);

    document.getElementById("questionText").textContent = quizQuestion;
    for(let i=0;i<quizCoice.length;i++){
        /*console.log(document.querySelectorAll('.choice-text')[i].textContent);*/
        document.querySelectorAll('.choice-text')[i].textContent = quizCoice[i];
    }
}
function displayContainer(container){
    const allActive = document.querySelectorAll('.activated');
    /*console.log(allActive);*/
    for(let i=0;i<allActive.length;i++){
        allActive[i].classList.remove('activated');
    }
    document.getElementById(container).classList.add('activated');
}
function changePage(){
    if(quizId<quizData.length){
        console.log(quizId+"\n"+quizData.length);
        quizId++;
        loadQuiz(quizId);
        if((quizId)==quizData.length){
            document.getElementById('previous').disabled=true;
        }
    }
    else{
        displayContainer('reviewPage');
    }
    
}