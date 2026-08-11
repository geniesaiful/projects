let quizPageNo,quizId,quizQuestion,quizChoice,quizAnswer;

function beginQuiz(){
    quizId = 1;
    loadQuiz(quizId);
    /*reset timer*/
    displayContainer('quizPage');
    /*start timer*/
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
        console.log(allRadioBtn[i].checked);
        allRadioBtn[i].checked=false;
    }


    quizId = id;
    quizQuestion = quizData[quizId-1].question;
    quizCoice = quizData[quizId-1].choices;
    quizAnswer = quizData[quizId-1].correctAnswer;
    // console.log(quizQuestion+"\n"+quizCoice+"\n"+quizAnswer);

    document.getElementById("questionText").textContent = quizQuestion;
    for(let i=0;i<quizCoice.length;i++){
        //console.log(document.querySelectorAll('.choice-text')[i].textContent);
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
function nextPage(){
    if(document.getElementById('previous').disabled=true){
        document.getElementById('previous').disabled=false;
    }
    if(quizId<quizData.length){
        //console.log(quizId+"\n"+quizData.length);
        quizId++;
        loadQuiz(quizId);
        if((quizId)==quizData.length){
            //console.log("HIT == "+quizId);
            document.getElementById('next').textContent="Finish Quiz";
        }
    }
    else{
        displayContainer('reviewPage');
    }
}
function prevPage(){
    if(document.getElementById('next').textContent==="Finish Quiz"){
        document.getElementById('next').textContent="Next";
    }
    //console.log(quizId+"\n"+quizData.length);
        quizId--;
    if(quizId==1){
        document.getElementById('previous').disabled=true;
        loadQuiz(quizId);
    }
    loadQuiz(quizId);
}