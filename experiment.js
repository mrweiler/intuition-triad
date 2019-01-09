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
    data: {trial: 'fixation cross'},
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
let coherenceJudgement = {
    type: 'html-keyboard-response',
    stimulus: function() {
        if (coherencePosition[0] === 'left') {
            return '<div class="coherenceleft">zusammenh&aumlngend</div>'
                +'<div class="coherenceright">zusammengew&uumlrfelt</div>';
        } else {
            return '<div class="coherenceleft">zusammengew&uumlrfelt</div>'
                +'<div class="coherenceright">zusammenh&aumlngend</div>';
        }
    },
    choices: ['s', 'l'],
    trial_duration: 2000,
    data: {
        coherence_position: coherencePosition[0],
        trial: 'coherence judgement',
    },
};

// Warning that reaction is too slow
let tooSlow = {
    type: 'html-keyboard-response',
    stimulus: 'Please respond faster!',
    choices: jsPsych.NO_KEYS,
    trial_duration: 1000,
    data: {trial: 'too slow'},
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
    data: {trial: 'solution word'},
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

// Enter subject id
let subjectId;
let enterSubjectId = {
    type: 'survey-text',
    questions: [{prompt: 'Bitte geben Sie Ihren Versuchspersonen-Code ein.'}],
    on_finish: function(data) {
        subjectId = JSON.parse(data.responses).Q0;
        jsPsych.data.addDataToLastTrial({
            subjectId: subjectId,
        });
    },
};

// General instructions
let instructions = {
    type: 'instructions',
    pages: [
        'First page with general instructions',
        'Second page with general instructions',
    ],
    show_clickable_nav: true,
    data: {trial: 'general instructions'},
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
        '<p class = "instructions">Nun kommt eine Aufgabe, in der Sie schnell '
        + 'reagieren sollen. </p>'
        + '<p class = "instructions">Zuerst kommt ein Training, in dem Sie '
        + 'lernen, in einer vorgegebenen Zeit schnell zu reagieren. Sie sehen '
        + 'im Folgenden immer ein Kreuz in der Mitte des Bildschirms f&uumlr '
        + 'eine kurze Zeit erscheinen. Danach taucht ein Ausrufezeichen rechts '
        + 'oder links von dem Kreuz auf.</p>'
        + '<p class = "instructions">Dr&uumlcken Sie bitte, wenn das '
        + 'Ausrufezeichen rechts erscheint, so schnell wie m&oumlglich auf die '
        + 'rechte Reaktionstaste von der Tastatur. Wenn das Ausrufezeichen '
        + 'links erscheint, dann dr&uumlcken Sie bitte auf die linke '
        + 'Reaktionstaste auf der Tastatur. </p>'
        + '<p class = "instructions">Sie haben jeweils nur 2 Sekunden Zeit '
        + 'f&uumlr diese Reaktion. Dies ist nur ein Trainingsdurchlauf. Sie '
        + 'k&oumlnnen ruhig Fehler machen und sich langsam an die schnelle '
        + 'Reaktionszeit gew&oumlhnen. </p>'
        + '<p class = "instructions">Mit der Leertaste geht es weiter... </p>',
    ],
    key_forward: 'space',
    show_clickable_nav: false,
    data: {trial: 'practice block instructions'},
};

// Practice stimuli
let practiceStimuli = [
    {practiceStimulus: '<div class="practiceleft">!</div>'},
    {practiceStimulus: '<div class="practiceright">!</div>'},
];

// Practice trial
let practiceTrial = {
    type: 'html-keyboard-response',
    stimulus: jsPsych.timelineVariable('practiceStimulus'),
    choices: ['s', 'l'],
    trial_duration: 2000,
    data: {trial: 'practice trial'},
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


/*
    Intuition and fluency stimuli pool
*/

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
// TO DO: add folder 'img/'
let intuitionStimuli = [
    {intuitionStimulus: intuitionStimuliPool[0] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[1] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[2] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[3] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[4] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[5] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[6] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[7] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[8] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[9] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[10] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[11] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[12] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[13] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[14] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[15] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[16] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[17] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[18] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[19] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[20] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[21] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[22] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[23] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[24] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[25] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[26] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[27] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[28] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[29] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[30] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[31] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[32] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[33] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[34] + '.png'},
    {intuitionStimulus: intuitionStimuliPool[35] + '.png'},
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

// Intuition block debriefing
let intuitionBlockDebriefing = {
    type: 'instructions',
    pages: [
        'This is the intuition block debriefing',
    ],
    show_clickable_nav: true,
};

// Intuition block
let intuitionBlock = {
    timeline: [intuitionBlockInstructions, intuitionProcedure,
    confidenceRating, intuitionBlockDebriefing],
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

// Fluency stimuli
let fluencyStimuli = [
    {fluencyStimulus: 'ink_01_low_r' + '.png'},
    {fluencyStimulus: 'ink_02_high_g' + '.png'},
    {fluencyStimulus: 'ink_03_low_b' + '.png'},
    {fluencyStimulus: 'koh_04_high_r' + '.png'},
    {fluencyStimulus: 'koh_05_low_g' + '.png'},
    {fluencyStimulus: 'koh_06_high_b' + '.png'},
];

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

// Fluency block debriefing
let fluencyBlockDebriefing = {
    type: 'instructions',
    pages: [
        'This is the fluency block debriefing',
    ],
    show_clickable_nav: true,
};

// Manipulation check 1
let manipulationCheck1 = {
    type: 'html-keyboard-response',
    stimulus: 'Konnten Sie alle Triaden entziffern? <br>(Dr&uumlcken Sie "j" '
        + 'f&uumlr ja und "n" f&uumlr nein)',
    choices: ['j', 'n'],
};

// Manipulation check 2
let manipulationCheck2 = {
    type: 'survey-text',
    questions: [{prompt: 'Wie viele Triaden konnten Sie nicht entziffern?'}],
};

// Manipulation check 2 node
let manipulationCheck2Node = {
    timeline: [manipulationCheck2],
    conditional_function: function() {
        let data = jsPsych.data.get().last(1).values()[0];
        if (data.key_press ==
            jsPsych.pluginAPI.convertKeyCharacterToKeyCode('n')) {
            return true;
        } else {
            return false;
        }
    },
};

// Fluency block
let fluencyBlock = {
    timeline: [fluencyBlockInstructions, fluencyProcedure, confidenceRating,
        manipulationCheck1, manipulationCheck2Node, fluencyBlockDebriefing],
};


/*
    Affective block
*/

// Affective block instructions
let affectiveBlockInstructions = {
    type: 'instructions',
    pages: [
        'First page with affective block instructions',
        'Second page with affective block instructions',
    ],
    show_clickable_nav: true,
};

// TO DO: Stimulus (1500) ink_08_neg.png, koh_12_pos.png, 01-24

// Affective stimuli
let affectiveStimuli = [
    {affectiveStimulus: 'ink_01_neg' + '.png'},
    {affectiveStimulus: 'ink_02_pos' + '.png'},
    {affectiveStimulus: 'koh_03_neg' + '.png'},
    {affectiveStimulus: 'koh_04_pos' + '.png'},
];

// Affective triad
let affectiveTriad = {
    // type: 'image-keyboard-response',
    type: 'html-keyboard-response',
    stimulus: jsPsych.timelineVariable('affectiveStimulus'),
    choices: jsPsych.NO_KEYS,
    trial_duration: 1500,
};

// Affective procedure
let affectiveProcedure = {
    timeline: [fixationCross, affectiveTriad, coherenceJudgement,
        tooSlowNode, solutionWordNode],
    timeline_variables: affectiveStimuli,
    randomize_order: true,
};

// Affective block debriefing
// TO DO: html-keyboard-response instead of instructions
let affectiveBlockDebriefing = {
    type: 'instructions',
    pages: [
        'Danke! Wenden Sie sich bitte an die Versuchsleiterin.',
    ],
    show_clickable_nav: true,
};

// Affective block
let affectiveBlock = {
    timeline: [affectiveBlockInstructions, affectiveProcedure,
        confidenceRating, affectiveBlockDebriefing],
};


// Main
jsPsych.init({
    timeline: [enterSubjectId, instructions, practiceBlock, intuitionBlock,
        fluencyBlock, affectiveBlock],
    on_finish: function() {
        let d = new Date();
        jsPsych.data.get().localSave('csv',
            subjectId + '_'
            + d.getFullYear() + '-'
            + ('0' + d.getMonth() + 1).slice(-2) + 1 + '-'
            + ('0' + d.getDate()).slice(-2) + '_'
            + ('0' + d.getHours()).slice(-2) + '-'
            + ('0' + d.getMinutes()).slice(-2) + '-'
            + ('0' + d.getSeconds()).slice(-2) + '_'
            + '.csv'
        );
    },
});
