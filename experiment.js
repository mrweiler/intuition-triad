/*
    Experiment
    author: Matthias Weiler
    date: 2018-11-30
*/

/*
    Instruction block
    Show instructions on several pages.
*/

// General instructions
let instructions = {
    type: 'instructions',
    pages: [
        'First page with general instructions',
        'Second page with general instructions',
    ],
    show_clickable_nav: true,
};


 /*
    Practice block
    Show an exclamation mark either on the left or on the right side of the
    screen.
    Number of trials: 20
*/

// Practice block instructions
let practiceBlockInstructions = {
    type: 'instructions',
    pages: [
        'First page with practice block instructions',
        'Second page with practice block instructions',
    ],
    show_clickable_nav: true,
};

// Practice stimuli
let practiceStimuli = [
    {stimulus: '<div class="left">!</div>'},
    {stimulus: '<div class="right">!</div>'},
];

// Practice trial
let practiceTrial = {
    type: 'html-keyboard-response',
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: ['s', 'l'],
    trial_duration: 2000,
};

// Practice procedure
let practiceProcedure = {
    timeline: [practiceTrial],
    timeline_variables: practiceStimuli,
    randomize_order: true,
    repetitions: 10,
};

  // practice block
let practiceBlock = {
    timeline: [practiceBlockInstructions, practiceProcedure],
};


// Main
jsPsych.init({
    timeline: [instructions, practiceBlock],
});
