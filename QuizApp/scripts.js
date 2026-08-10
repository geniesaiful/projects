

function beginQuiz(){
    /*reset timer*/
    displayContainer('quizPage');
    /*start timer*/
}

function displayContainer(container){
    console.log("hellow World");
    const allActive = document.querySelectorAll('.activated');
    console.log(allActive);
    for(let i=0;i<allActive.length;i++){
        allActive[i].classList.remove('activated');
    }
    document.getElementById(container).classList.add('activated');
}

