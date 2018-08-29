// Data controller
const dataController = (function() {

    // Delete a project from data structure

    // Project class
    class Project {
        constructor(id, title) {
            this.id = id;
            this.title = title;
        }
    }

    // Project data
    const projects = {
        allProjects: []
    };

    // Publicly accessible
    return {

        // Add project
        addProject: function(title) {

            // Create ID
            let ID;
            if (projects.allProjects.length > 0) {
                ID = projects.allProjects[projects.allProjects.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create a new instance
            let newProject = new Project(ID, title);

            // Add the project to the project data
            projects.allProjects.push(newProject);

            // Return the new project
            return newProject;

        },

        // Testing
        testing: function() {
            console.log(projects);
        }

    };
    
})();

// UI controller
const UIController = (function() {

    // Variables
    let intervalID;

    // Get the element classes
    const DOMstrings = {
        projectForm: '.project-form',
        inputValue: 'input[type="text"]',
        projectList: '.projects',
        hoursSpan: '.hours',
        minutesSpan: '.minutes',
        secondsSpan: '.seconds'
    };

    // Create variables from DOMstrings
    const {projectForm, inputValue, projectList, hoursSpan, minutesSpan, secondsSpan} = DOMstrings;

    // Delete project from UI

    // Publicly accessible
    return {

        // Get input value
        getInput: function() {
            return document.querySelector(inputValue);
        },

        // Add project to UI
        addProjectToUI: function(obj) {

            // Create markup
            let html = `
            <li id="project-${obj.id}">
                <h2>${obj.title}</h2>
                <div class="timer">
                    <p class="timer-label">Total Time Spent</p>
                    <p class="timer-text"><span class="hours">00</span>:<span class="minutes">00</span>:<span class="seconds">00</span></p>
                </div>
                <button class="btn start">Start</button>
                <button class="delete-btn"><i class="fa fa-times"></i></button>
            </li>
            `;

            // Insert the HTML into the DOM
            document.querySelector(projectList).insertAdjacentHTML('beforeend', html);

        },

        // Clear field
        clearField: function() {
            const input = document.querySelector(inputValue);
            input.value = '';
        },

        // Start the timer
        startTimer: function(event) {

            const target = event.target.previousElementSibling.lastElementChild;
            const seconds = target.querySelector(secondsSpan);
            const minutes = target.querySelector(minutesSpan);
            const hours = target.querySelector(hoursSpan); 

            let sec = 0;
            intervalID = setInterval(function() {
                sec++;
                seconds.textContent = (`0${sec % 60}`).substr(-2);
                minutes.textContent = (`0${(parseInt(sec / 60)) % 60}`).substr(-2);
                hours.textContent = (`0${parseInt(sec / 3600)}`).substr(-2);
            }, 1000);

            // Add interval ID to event target as an attribute
            target.setAttribute('timer-id', intervalID);

        },

        // Stop the timer
        stopTimer: function(event) {
            const target = event.target.previousElementSibling.lastElementChild;
            clearInterval(target.getAttribute('timer-id'));
        },

        // Update project name in UI
        edit: function(event) {
            
            const input = document.createElement('input');
            const title = event.target;
            const parent = title.parentNode;
            input.value = title.textContent;
            parent.insertBefore(input, title);
            parent.removeChild(title);

        },

        // Save the project title in UI
        save: function(event) {

            const title = document.createElement('h2');
            const input = event.target;
            const parent = input.parentNode;
            title.textContent = input.value;
            parent.insertBefore(title, input);
            parent.removeChild(input);

        },

        // Delete the project in the UI
        delete: function(projectID) {
            let projectToDelete = document.getElementById(projectID);
            projectToDelete.parentNode.removeChild(projectToDelete);
        },

        // Make the DOMstrings public
        getDOMstrings: function() {
            return DOMstrings;
        }

    };
    
})();

// Global app controller
const controller = (function(dataCtrl, UICtrl) {

    // Event listeners
    const setupEventListeners = function() {

        // Get the DOMstrings
        const DOM = UICtrl.getDOMstrings();

        // When the form is submitted
        const form = document.querySelector(DOM.projectForm);
        form.addEventListener('submit', ctrlAddProject);

        const projects = document.querySelector(DOM.projectList);

        projects.addEventListener('click', function(event) {

            // When the start button is clicked
            if (event.target.className === 'btn start' || event.target.className === 'btn start stop') {
                timer(event);
            }

            // When the project title is clicked
            if (event.target.tagName === 'H2') {
                editTitle(event);
            }

            // When the delete button is clicked
            if (event.target.className === 'delete-btn' || event.target.tagName === 'I') {
                deleteProject(event);
            }

        });

        // When the enter key is pressed
        projects.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                saveTitle(event);
            }
        });

    };

    // Add new project
    const ctrlAddProject = function(event) {

        // Prevent default behavior
        event.preventDefault();

        // Get the input
        let input = UICtrl.getInput();

        // If the input is not empty
        if (input.value !== '') {
            
            // Add the project to the data controller
            let newProject = dataCtrl.addProject(input.value);

            // Add the project to the UI
            UICtrl.addProjectToUI(newProject);

            // Clear the input field
            UICtrl.clearField();
        }

    };

    // Timer
    const timer = function(event) {

        let target = event.target;

        // Toggle the button color
        target.classList.toggle('stop');

        // If the button's text is start
        if (target.textContent === 'Start') {

            target.textContent = 'Stop';
            UICtrl.startTimer(event);
    
        // If the button's text is stop
        } else if (target.textContent === 'Stop') {

            target.textContent = 'Start';
            UICtrl.stopTimer(event);

        }

    };

    // Edit the project title
    const editTitle = function(event) {
        UICtrl.edit(event);
    };

    // Save the project title
    const saveTitle = function(event) {
        UICtrl.save(event);
    };

    // Delete project
    const deleteProject = function(event) {
        let target = event.target;
        let projectID = target.parentNode.id;

        if (projectID) {

            // Delete the project from the data structure

            // Delete the item from the UI
            UICtrl.delete(projectID);
            
        }
    };

    // Publicly accessible
    return {
        
        // Initialization
        init: function() {
            console.log('Application has started');
            setupEventListeners();
        }

    };
    
})(dataController, UIController);

// Initialize
controller.init();