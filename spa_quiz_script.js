const app_stage = {
    current_stage : "",
    quiz_choice : "",
    user_name : "",
    is_quiz_one : false,
    is_correct : false,
    did_pass : false,
    current_question : -1,
    current_model : {},
    current_correct : 0,
    current_incorrect : 0, 
    current_score : 0,
    question_count: 20,
    questions_left: 20

}

let timeSec = 0;
let elapsedTime = 0;

document.addEventListener('DOMContentLoaded', ()  => {
    app_stage.current_stage = "#init_view"
   
    app_stage.current_model = {
        action : "start_app"
    }
    
     update_view(app_stage)
    
    document.querySelector("#app_widget").onclick = (e) => {

        handle_widget_events(e)
        console.log(e.target.dataset.answer)
    }
});

function handle_widget_events(e) {

    if(app_stage.current_stage == "#init_view") {
       
        if (e.target.dataset.action == "start_app") {
            
            app_stage.user_name = document.querySelector('input[name="user_name"]').value
            app_stage.quiz_choice = document.querySelector('input[name="quiz_choice"]:checked').value;
            
            app_stage.current_question = 0;

            elapsedTime = setInterval(startTimer, 1000);
            minutesCount = document.getElementById("minutes")
            secondsCount = document.getElementById("seconds")

            if (app_stage.quiz_choice == "quiz_one") {
                app_stage.is_quiz_one = true;
            } else if (app_stage.quiz_choice == "quiz_two") {
                app_stage.is_quiz_one = false;
            }

            var current_question_data = get_quiz_data(app_stage.quiz_choice, app_stage.current_question)

            console.log(current_question_data)
           
            console.log(app_stage)
            console.log(app_stage.current_model)
            console.log(app_stage.current_model.question)
        }       
    }

    if(app_stage.current_stage == "#question_multChoice_view") {
        if(e.target.dataset.action == "answer") {

            e.target.dataset.answer = document.querySelector('input[name="answer"]:checked').value;

            isCorrect = check_user_response(e.target.dataset.answer, app_stage.current_model)

            if (isCorrect == true) {
                positiveFeedbackView();
                app_stage.current_correct++;               
                app_stage.is_correct = true
            } 
            else if (isCorrect == false) {
                render_feedback_view(app_stage.current_model, "#feedback_negative_view");
                app_stage.current_incorrect++;
                app_stage.is_correct = false
            }

            app_stage.current_score = app_stage.current_correct * 5;
 
        }
    }

    if(app_stage.current_stage == "#question_textInput_view") {
        if (e.target.dataset.action == "answer") {
            
            e.target.dataset.answer = document.querySelector('input[name="text_answer"]').value;
           
            isCorrect = check_user_response(e.target.dataset.answer, app_stage.current_model);

            if (isCorrect == true) {
                positiveFeedbackView();
                app_stage.current_correct++;
                app_stage.is_correct = true
            } 
           
            else if (isCorrect == false) {
                render_feedback_view(app_stage.current_model, "#feedback_negative_view");
                app_stage.current_incorrect++;
                app_stage.is_correct = false
            }

            app_stage.current_score = app_stage.current_correct * 5;

        }
    }

    if(app_stage.current_stage == "#question_trueFalse_view") {
        if(e.target.dataset.action == "answer") {
            
            e.target.dataset.answer = document.querySelector('input[name="answer"]:checked').value;
            isCorrect = check_user_response(e.target.dataset.answer, app_stage.current_model)

            if (isCorrect == true) {
                positiveFeedbackView();
                app_stage.current_correct++;
                app_stage.is_correct = true
            } 
            else if (isCorrect == false) {
                render_feedback_view(app_stage.current_model, "#feedback_negative_view");
                app_stage.current_incorrect++;
                app_stage.is_correct = false
            }

            app_stage.current_score = app_stage.current_correct * 5;

        }

    }

    if(app_stage.current_stage == "#question_multTextInput_view") {
        if(e.target.dataset.action == "answer") {
            
            let user_response = []
            let input1 = document.querySelector(`#${app_stage.current_model.answer1FieldId}`).value;
            let input2 = document.querySelector(`#${app_stage.current_model.answer2FieldId}`).value;

            user_response.push(input1)
            user_response.push(input2)

            isCorrect = check_user_response(user_response, app_stage.current_model)   
         

            if (isCorrect == true) {
                positiveFeedbackView();
                app_stage.current_correct++;
                app_stage.is_correct = true
            } 
            else if (isCorrect == false) {
                render_feedback_view(app_stage.current_model, "#feedback_negative_view");
                app_stage.current_incorrect++;
                app_stage.is_correct = false
            }

            app_stage.current_score = app_stage.current_correct * 5;

        }
    }

    if(app_stage.current_stage == "#question_selectChoice_view") {
        if (e.target.dataset.action == "answer") {
            var user_response = []
            var selected = document.querySelector('input[name="select_choice"]:checked');
            for (var i = 0; i < selected.length; i++) {
                user_response.push(selected[i].value)
            }

            
            isCorrect = check_user_response(user_response, app_stage.current_model)

            if (isCorrect == true) {
                positiveFeedbackView();
                app_stage.current_correct++;
                app_stage.is_correct = true
            } 
            else if (isCorrect == false) {
                render_feedback_view(app_stage.current_model, "#feedback_negative_view");
                app_stage.current_incorrect++;
                app_stage.is_correct = false
            }

            app_stage.current_score = app_stage.current_correct * 5;

        }
    }

    if(app_stage.current_stage == "#feedback_negative_view") {
        if(e.target.dataset.action == "continue") {
            updateQuestion(app_stage)

            setQuestionView(app_stage)

            update_view(app_stage)
        }       
    }

    if(app_stage.current_stage == "#app_end_view") { 
        if (app_stage.current_score < 80) {
            app_stage.did_pass = false;
        } else if (app_stage.current_score >= 80) {
            app_stage.did_pass = true;
        }

        if(e.target.dataset.action == "start_again") { 
            timeSec = 0
            secondsCount.innerHTML.pad(0)
            minutesCount.innerHTML.pad(0)
            elapsedTime = setInterval(startTimer, 1000)

            app_stage.current_question = -1
            app_stage.current_incorrect = 0
            app_stage.current_correct = 0
            app_stage.current_score = 0
            app_stage.questions_left = 20
            updateQuestion(app_stage)
            setQuestionView(app_stage)
            update_view(app_stage)

        } 
        else if(e.target.dataset.action == "return") {
            timeSec = 0
            secondsCount.innerHTML.pad(0)
            minutesCount.innerHTML.pad(0)
           
            app_stage.current_stage = "#init_view"
            app_stage.quiz_choice = ""
            app_stage.current_model = {}
            app_stage.current_question = 0
            app_stage.current_incorrect = 0
            app_stage.current_correct = 0
            app_stage.current_score = 0
            app_stage.current_model = {action : "start_app"}
            app_stage.current_question = -1
            app_stage.questions_left = 20

            update_view(app_stage)
        }
    }

    return false
}

function startTimer() { 
    ++timeSec;
    secondsCount.innerHTML = pad(timeSec % 60);
    minutesCount.innerHTML = pad(parseInt(timeSec/60));
}

function pad(x) {
    var toString = x + "";
    if (toString.length < 2) {
        return "0" + toString;       
    } else {
        return toString;
    }
}

function positiveFeedbackView() {
    
    render_feedback_view(app_stage.current_model, "#feedback_positive_view")
    
    if(app_stage.current_question == (app_stage.question_count - 1)) {
        setTimeout(() => {
            app_stage.current_question = -2

            setQuestionView(app_stage)
            update_view(app_stage)
        }, 1000);
    } else {
        setTimeout(() => {                   
            setQuestionView(app_stage)
            updateQuestion(app_stage)
            update_view(app_stage)
        }, 1000);
    }
}

function check_user_response(user_answer, model) {
    
    if(model.question_type == "mult_select_choice" || model.question_type == "question_multInput_text") { 
        if (JSON.stringify(user_answer) === JSON.stringify(model.correct_answer)) {
            return true;
        }
    } else {      
        if (user_answer == model.correct_answer) {
            return true;
        }
    }
    
    return false;
}

function updateQuestion(app_stage) {
    if(app_stage.current_question < (app_stage.question_count - 1)) {
        app_stage.current_question = app_stage.current_question + 1
        app_stage.questions_left--;

        let current_question_data = get_quiz_data(app_stage.quiz_choice, app_stage.current_question)

    }
    else { // end of quiz
        app_stage.current_question = -2;
        app_stage.current_model = {}
    }
}

function setQuestionView(app_stage) {
    if (app_stage.current_question == -2) {
        app_stage.current_stage = "#app_end_view"
        return
    }

    if (app_stage.current_model.question_type == "mult_choice_text") {
        app_stage.current_stage = "#question_multChoice_view"
    }
    else if (app_stage.current_model.question_type == "question_input_text") {
        app_stage.current_stage = "#question_textInput_view" 
    }
    else if (app_stage.current_model.question_type == "question_trueFalse") {
        app_stage.current_stage = "#question_trueFalse_view"
    }
    else if (app_stage.current_model.question_type == "question_multInput_text") {
        app_stage.current_stage = "#question_multTextInput_view"
    } 
    else if (app_stage.current_model.question_type == "mult_select_choice") {
        app_stage.current_stage = "#question_selectChoice_view"
    }
}

async function get_quiz_data(quiz_choice, current_question) {
    var api_url = 'https://my-json-server.typicode.com/Elson0129/CUS1172_Assignment03_Quizdata'
    var endpoint = `${api_url}/${quiz_choice}/${current_question}`

    const data = await fetch(endpoint)
    var model = await data.json()

    app_stage.current_model = model;

    setQuestionView(app_stage);

    update_view(app_stage);

    return model
}

function render_feedback_view(model, view) {
    app_stage.current_stage = view
    var source = document.querySelector(view).innerHTML;
    var template = Handlebars.compile(source)
    var html = template({...model,...app_stage})

    document.querySelector("#app_widget").innerHTML = html

    console.log(app_stage)
}

function update_view (app_stage) {

    const html_element = render_widget(app_stage.current_model, app_stage.current_stage)
    document.querySelector("#app_widget").innerHTML = html_element;
    
}

const render_widget = (model, view) => {
    template_source = document.querySelector(view).innerHTML

    var template = Handlebars.compile(template_source);

    var html_widget_element = template({...model,...app_stage})
    return html_widget_element
}