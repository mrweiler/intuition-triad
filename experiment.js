/*
    Experiment
    author: Matthias Weiler
    date: 2018-11-30
*/


/*
    General components
*/

// Fixation cross
let fixationCross = {
    type: 'html-keyboard-response',
    stimulus: '<div class="fixation">+</div>',
    choices: jsPsych.NO_KEYS,
    trial_duration: 500,
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

// Coherence position
let coherencePositions = ['left', 'right'];
let coherencePosition =
    jsPsych.randomization.sampleWithReplacement(coherencePositions, 1);

// Coherence judgement
// TO DO: zusammenhängend / zusammengewürfelt unten links bzw. unten rechts.
let coherenceJudgement = {
    type: 'html-keyboard-response',
    stimulus: function() {
        if (coherencePosition == 'left') {
            return 'Press "s" for coherent or "l" for incoherent';
        } else {
            return 'Press "s" for incoherent or "l" for coherent';
        }
    },
    choices: ['s', 'l'],
    trial_duration: 2000,
};

// Warning that reaction is too slow
let tooSlow = {
    type: 'html-keyboard-response',
    stimulus: 'Please respond faster!',
    choices: jsPsych.NO_KEYS,
    trial_duration: 1000,
};

// Show warning in case that reaction was too slow
let tooSlowNode = {
    timeline: [tooSlow],
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

// Solution word
let solutionWord = {
    type: 'survey-text',
    questions: [{prompt: 'Bitte geben Sie ein X oder ein L&oumlsungswort ein'}],
    trial_duration: 8000,
};

// Only show solution word if not too slow
let solutionWordNode = {
    timeline: [solutionWord],
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

// Practice procedure
let practiceProcedure = {
    timeline: [fixationCross, practiceTrial, tooSlowNode],
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


// Intuition and fluency stimuli pool
// 36 coherence stimuli
let coherenceStimuliPool = [
    'koh_01', 'koh_02', 'koh_03', 'koh_04', 'koh_05',
    'koh_06', 'koh_07', 'koh_08', 'koh_09', 'koh_10',
    'koh_11', 'koh_12', 'koh_13', 'koh_14', 'koh_15',
    'koh_16', 'koh_17', 'koh_18', 'koh_19', 'koh_20',
    'koh_21', 'koh_22', 'koh_23', 'koh_24', 'koh_25',
    'koh_26', 'koh_27', 'koh_28', 'koh_29', 'koh_30',
    'koh_31', 'koh_32', 'koh_33', 'koh_34', 'koh_35',
    'koh_36',
];

// 36 incoherence stimuli
let incoherenceStimuliPool = [
    'ink_01', 'ink_02', 'ink_03', 'ink_04', 'ink_05',
    'ink_06', 'ink_07', 'ink_08', 'ink_09', 'ink_10',
    'ink_11', 'ink_12', 'ink_13', 'ink_14', 'ink_15',
    'ink_16', 'ink_17', 'ink_18', 'ink_19', 'ink_20',
    'ink_21', 'ink_22', 'ink_23', 'ink_24', 'ink_25',
    'ink_26', 'ink_27', 'ink_28', 'ink_29', 'ink_30',
    'ink_31', 'ink_32', 'ink_33', 'ink_34', 'ink_35',
    'ink_36',
];


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

// Add 18 coherence stimuli to intuition stimuli pool
let intuitionStimuliPool = jsPsych.randomization.sampleWithoutReplacement(
    coherenceStimuliPool, 18);

// Add 18 incoherence stimuli to intuition stimuli pool
intuitionStimuliPool.push(...jsPsych.randomization.sampleWithoutReplacement(
    incoherenceStimuliPool, 18));

// Shuffle intuition stimuli
intuitionStimuliPool = jsPsych.randomization.repeat(intuitionStimuliPool, 1);

// Intuition stimuli
let intuitionStimuli = [
    {intuitionStimulus: intuitionStimuliPool[0] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[1] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[2] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[3] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[4] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[5] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[6] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[7] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[8] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[9] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[10] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[11] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[12] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[13] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[14] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[15] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[16] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[17] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[18] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[19] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[20] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[21] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[22] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[23] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[24] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[25] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[26] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[27] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[28] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[29] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[30] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[31] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[32] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[33] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[34] + '.bmp'},
    {intuitionStimulus: intuitionStimuliPool[35] + '.bmp'},
];

// Intuition triad
let intuitionTriad = {
    // type: 'image-keyboard-response',
    type: 'html-keyboard-response',
    stimulus: jsPsych.timelineVariable('intuitionStimulus'),
    choices: jsPsych.NO_KEYS,
    trial_duration: 1500,
};

// Intuition procedure
let intuitionProcedure = {
    timeline: [fixationCross, intuitionTriad, coherenceJudgement, tooSlowNode,
        solutionWordNode],
    timeline_variables: intuitionStimuli,
    randomize_order: true,
};

// Intuition block
let intuitionBlock = {
    timeline: [intuitionBlockInstructions, intuitionProcedure,
    confidenceRating],
};


/*
    Fluency block
*/

// Fluency block instructions
let fluencyBlockInstructions = {
    type: 'instructions',
    pages: [
        'First page with fluency block instructions',
        'Second page with fluency block instructions',
    ],
    show_clickable_nav: true,
};

// Take 9 coherence stimuli to the high fluency stimuli pool
let highFluencyStimuliPool =
    jsPsych.randomization.sampleWithoutReplacement(coherenceStimuliPool, 9);

// Add 9 incoherence stimuli to high fluency stimuli pool
highFluencyStimuliPool.push(...jsPsych.randomization.sampleWithoutReplacement(
        incoherenceStimuliPool, 9));

// TODO: Add 'high' to high fluency stimuli pool


// Take 9 coherence stimuli to the low fluency stimuli pool
let lowFluencyStimuliPool =
    jsPsych.randomization.sampleWithoutReplacement(coherenceStimuliPool, 9);

// Add 9 incoherence stimuli to low fluency stimuli pool
lowFluencyStimuliPool.push(...jsPsych.randomization.sampleWithoutReplacement(
        incoherenceStimuliPool, 9));

// TODO: Add 'low' to high fluency stimuli pool

// TODO: Add either 'r', 'g', or 'b' to all fluency stimuli

// Fluency triad
let fluencyTriad = {
    // type: 'image-keyboard-response',
    type: 'html-keyboard-response',
    stimulus: jsPsych.timelineVariable('fluencyStimulus'),
    choices: jsPsych.NO_KEYS,
    trial_duration: 1500,
};

// Fluency procedure
let fluencyProcedure = {
    timeline: [fixationCross, fluencyTriad, coherenceJudgement,
        tooSlowNode, solutionWordNode],
    timeline_variables: fluencyStimuli,
    randomize_order: true,
};

// Fluency block
let fluencyBlock = {
    timeline: [fluencyBlockInstructions, fluencyProcedure, confidenceRating],
};


// Block affektive Stimuli
  // 48 Trials
    // Fixationskreuz (500)
    // Triade: Stimulus (1500) ink_08_neg.bmp, koh_12_pos.bmp, ...
    // Coherence judgement: Eingabe kohärent/inkohärent (2000)
      // Zu langsam, falls keine Eingabe innerhalb 2000 ms (300)
    // Solution word: Eingabe des Oberbegriffs (8000)

// Rating: Wie sehr haben Sie Ihrer Intuition vertraut?


// Manipulationscheck
// Ḱonnten Sie alle Triaden entziffern?
    // Wenn nein: Wie viele Triaden konnten Sie nicht entziffern?


// Debriefing
// Danke! Wenden Sie sich bitte an die Versuchsleiterin.

// Main
jsPsych.init({
    timeline: [instructions, practiceBlock, intuitionBlock, fluencyBlock],
    // timeline: [intuitionBlock],
    on_finish: function() {
        jsPsych.data.displayData();
    },
});
