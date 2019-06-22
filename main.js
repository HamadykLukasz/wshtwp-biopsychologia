"use strict";

const total = +prompt("Wpisz liczbę pytań do wylosowania", 15);
var counter = 1;
      
      (total == 0) ? location.reload() : init();

      function init(){
        let url =
              "https://raw.githubusercontent.com/HamadykLukasz/wshtwp-biopsychologia/master/pytania_biopsychologia.json";
            
          fetch(url)
              .then(function (response) {
                  return response.json();
              })
              .then(function (data) {
                let questions = randomizeQuestions(data, total)
                let answers = new Array(total);
                console.log(questions);

                displayResults(questions, answers);
              });
      }

      function randomizeQuestions(data, n) {
        let result = new Array(n),
          len = data.length,
          taken = new Array(len);

        if (n > len)
          throw new RangeError("getRandom: more elements taken than available");

        while (n--) {
          let x = Math.floor(Math.random() * len);
          result[n] = data[x in taken ? taken[x] : x];
          taken[x] = --len in taken ? taken[len] : len;
        }
    
        return result;
      }

      function displayResults(questions, answers){
            
            generateQuestion(questions, counter);
            showNext(questions,answers, counter);
            showAnswer(answers, counter, questions);
      }

      function checkTotalAnswers(answers){
        if(!answers.includes(undefined)){
            let btn = document.getElementById("btn-finish");
            let info = document.getElementById("info-finish");
            btn.disabled = false; 
            info.parentNode.removeChild(info); 
        }
      }

      function showAnswer(array, i, questions){
        let answerSelector = "answer-" + i;
        let answerImg = document.getElementById(answerSelector);
        let btnCorrect = document.getElementById("correct");
        let btnWrong = document.getElementById("wrong");

        answerImg.onclick = function(){
          this.classList.remove("answer-hidden");
          btnCorrect.disabled = false;
          btnWrong.disabled = false;
          if(i == total){
            let btnFinish = document.getElementById("btn-finish");
            btnFinish.onclick = function(){
              countPoints(array, questions);
            };
          }
          this.onclick = '';
        };
        btnCorrect.onclick = function(){storeAnswer(array,true,i);};
        btnWrong.onclick = function(){storeAnswer(array,false,i);};
      }

      function showNext(qst, ans, counter){
        let btnNext = document.getElementById("btn-next");
        btnNext.onclick = function () {
          removeElement('tile-'+counter);
          counter++;
          generateQuestion(qst, counter);
          showAnswer(ans, counter, qst);
          
        };
      }

      function storeAnswer(array, result, i){
        array.splice(i-1, 0, result);
        let btnNext = document.getElementById("btn-next");
        console.log(i);
        if(i !== total){
          btnNext.disabled = false;
        } 
        document.getElementById("correct").disabled = true;
        document.getElementById("wrong").disabled = true;
        console.log(array);
      }


      function countPoints(array, questions){
        let points = array.filter(Boolean).length;
        let html = "<ul class='review'>";

        for(let j = 0; j < total; j++){
          if(array[j] == false){
            html += "<li>" + questions[j].id + ". " + questions[j].body + "</li>";
          }
        }

        html += "</ul>";

        console.log(html);
        
    
        if(calculatePercentage(points, total) >= 60 && calculatePercentage(points, total) <= 100){
            Swal.fire(
            'Gratulacje!',
            'Liczba poprawnych odpowiedzi: ' + points + "/" + total + " ("+ Math.round(calculatePercentage(points, total)) + "%)",
            'success'
            ).then(function(){
              Swal.fire({
                title: '<strong>Pytania do poprawy</strong>',
                type: 'info',
                html:
                  html,
                showCloseButton: true,
                confirmButtonText:
                  '<i class="fa fa-thumbs-up"></i> Jeszcze raz!',
                confirmButtonAriaLabel: 'Thumbs up, great!',
              }).then(function(){
                location.reload();
              });
            });
        } else {
            Swal.fire(
            'Niestety :(',
            'Liczba poprawnych odpowiedzi: ' + points + "/" + total + " ("+ Math.round(calculatePercentage(points, total))  + "%)",
            'error'
            ).then(function(){
              Swal.fire({
                title: '<strong>Pytania do poprawy</strong>',
                type: 'info',
                html:
                  html,
                showCloseButton: true,
                confirmButtonText:
                  '<i class="fa fa-thumbs-up"></i> Jeszcze raz!',
                confirmButtonAriaLabel: 'Thumbs up, great!',
              }).then(function(){
                location.reload();
              });
            });
        }
      }
    
      function calculatePercentage(part, total){
          return (100 * part) / total;
      }

      function removeElement(elementId) {
        // Removes an element from the document
        var element = document.getElementById(elementId);
        element.parentNode.removeChild(element);
    }

      function generateQuestion(questions, i){
        let html = "";
        if(i == 1){
          html += "<div id='tile-"+i+"' class='tile'>";
          html += "<div class='q-body'>" + questions[i-1].id + ". " + questions[i-1].body + "</div>";
          html += "<img id='answer-"+i+"' class='answer-hidden' src='"+questions[i-1].answer+"' /></div>";
        }  else {
          html += "<div id='tile-"+i+"' class='tile'>";
          html += "<div class='q-body'>" + questions[i-1].id + ". " + questions[i-1].body + "</div>";
          html += "<img id='answer-"+i+"' class='answer-hidden' src='"+questions[i-1].answer+"' /></div>";
          if(i == total){
              document.getElementById("next").innerHTML = "<button id='btn-finish'>Pokaż wyniki</>";
          }
        }
        document.getElementById("results").innerHTML += html;
      }