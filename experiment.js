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

// Practice fixation cross
let practiceFixationCross = {
    type: 'html-keyboard-response',
    stimulus: '<div class="fixation">+</div>',
    choices: jsPsych.NO_KEYS,
    trial_duration: 500,
};

// Practice stimuli
let practiceStimuli = [
    {practiceStimulus: '<div class="left">!</div>'},
    {practiceStimulus: '<div class="right">!</div>'},
];

// Practice trial
let practiceTrial = {
    type: 'html-keyboard-response',
    stimulus: jsPsych.timelineVariable('practiceStimulus'),
    choices: ['s', 'l'],
    trial_duration: 2000,
};

// Warning that reaction is too slow
let practiceTooSlow = {
    type: 'html-keyboard-response',
    stimulus: 'Please respond faster!',
    trial_duration: 1000,
};

// Show warning in case that reaction was too slow
let practiceTooSlowNode = {
    timeline: [practiceTooSlow],
    conditional_function: function() {
        let data = jsPsych.data.get().last(1).values()[0];
        if (data.key_press ==
          jsPsych.pluginAPI.convertKeyCharacterToKeyCode('NULL')) {
            return true;
        } else {
            return false;
        }
    },
};

// Practice procedure
let practiceProcedure = {
    timeline: [practiceFixationCross, practiceTrial, practiceTooSlowNode],
    timeline_variables: practiceStimuli,
    randomize_order: true,
    repetitions: 10,
};

// Practice block debriefing
let practiceBlockDebriefing = {
    type: 'instructions',
    pages: [
        'This is the practice block debriefing',
    ],
    show_clickable_nav: true,
};

// Practice block
let practiceBlock = {
    timeline: [practiceBlockInstructions, practiceProcedure,
      practiceBlockDebriefing],
};


/*
    Intuition block
*/

// Intuition block instructions
let intuitionBlockInstructions = {
    type: 'instructions',
    pages: [
        'First page with intuition block instructions',
        'Second page with intuition block instructions',
    ],
    show_clickable_nav: true,
};

// Intuition fixation cross
let intuitionFixationCross = {
    type: 'html-keyboard-response',
    stimulus: '<div class="fixation">+</div>',
    choices: jsPsych.NO_KEYS,
    trial_duration: 500,
};

// Intuition stimuli
let intuitionStimuli = [
    {intuitionStimulus: 'ink01.bmp'},
    {intuitionStimulus: 'koh01.bmp'},
];

// Intuition triade
let intuitionTriade = {
    // type: 'image-keyboard-response',
    type: 'html-keyboard-response',
    stimulus: jsPsych.timelineVariable('intuitionStimulus'),
    choices: jsPsych.NO_KEYS,
    trial_duration: 1500,
};

// Coherence position
let intuitionCoherencePositions = ['left', 'right'];
let intuitionCoherencePosition =
    jsPsych.randomization.sampleWithReplacement(intuitionCoherencePositions, 1);

// Coherence judgement
let intuitionCoherenceJudgement = {
    type: 'html-keyboard-response',
    stimulus: function() {
        if (intuitionCoherencePosition == 'left') {
            return 'Press "s" for coherent or "l" for incoherent';
        } else {
            return 'Press "s" for incoherent or "l" for coherent';
        }
    },
    choices: ['s', 'l'],
    trial_duration: 2000,
};

// Warning that reaction is too slow
let intuitionTooSlow = {
    type: 'html-keyboard-response',
    stimulus: 'Please respond faster!',
    choices: jsPsych.NO_KEYS,
    trial_duration: 1000,
};

// Show warning in case that reaction was too slow
let intuitionTooSlowNode = {
    timeline: [intuitionTooSlow],
    conditional_function: function() {
        let data = jsPsych.data.get().last(1).values()[0];
        if (data.key_press ==
          jsPsych.pluginAPI.convertKeyCharacterToKeyCode('NULL')) {
            return true;
        } else {
            return false;
        }
    },
};

// Intuition solution word
let intuitionSolutionWord = {
    type: 'survey-text',
    questions: [{prompt: 'Bitte geben Sie ein X oder ein L&oumlsungswort ein'}],
    trial_duration: 8000,
};

// Only show intuition solution word if not too slow
let intuitionSolutionWordNode = {
    timeline: [intuitionSolutionWord],
    conditional_function: function() {
        let data = jsPsych.data.get().last(1).values()[0];
        if (data.key_press ==
          jsPsych.pluginAPI.convertKeyCharacterToKeyCode('NULL')) {
            return false;
        } else {
            return true;
        }
    },
};

// Intuition procedure
let intuitionProcedure = {
    timeline: [intuitionFixationCross, intuitionTriade,
        intuitionCoherenceJudgement, intuitionTooSlowNode,
        intuitionSolutionWordNode],
    timeline_variables: intuitionStimuli,
    randomize_order: true,
};

// Confidence rating
let scaleConfidenceRating = ['0: Gar nicht', '1', '2', '3', '4', '5',
    '6: Sehr stark'];
let confidenceRating = {
    type: 'survey-likert',
    questions: [{
        prompt: 'Die Aufgabe ist geschafft! Wenn Sie auf die Aufgabe '
            + 'zur&uumlckblicken, wie sehr haben Sie Ihrer Intuition vertraut?',
        labels: scaleConfidenceRating,
    }],
};

// Intuition block
let intuitionBlock = {
  timeline: [intuitionBlockInstructions, intuitionProcedure, confidenceRating],
};


// Main
jsPsych.init({
    timeline: [instructions, practiceBlock, intuitionBlock],
    // timeline: [intuitionBlock],
    on_finish: function() {
        jsPsych.data.displayData();
    },
});
