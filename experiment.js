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
    data: {trial: 'practice block debriefing'},
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
let coherenceStimuliPool = createStimuliPool(poolSize = 36);
coherenceStimuliPool = addPrefix(prefix = 'koh_',
    stimuli = coherenceStimuliPool);

// 36 incoherence stimuli
let incoherenceStimuliPool = createStimuliPool(poolSize = 36);
incoherenceStimuliPool = addPrefix(prefix = 'ink_',
    stimuli = incoherenceStimuliPool);

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

// Add file ending to intuition stimuli
intuitionStimuliPool = addPostfix(postfix = '.png',
    stimuli = intuitionStimuliPool);

// Add image directory
intuitionStimuliPool = addPrefix(prefix = 'img/',
    stimuli = intuitionStimuliPool);

// Intuition stimuli
let intuitionStimuli = [
    {intuitionStimulus: intuitionStimuliPool[0]},
    {intuitionStimulus: intuitionStimuliPool[1]},
    {intuitionStimulus: intuitionStimuliPool[2]},
    {intuitionStimulus: intuitionStimuliPool[3]},
    {intuitionStimulus: intuitionStimuliPool[4]},
    {intuitionStimulus: intuitionStimuliPool[5]},
    {intuitionStimulus: intuitionStimuliPool[6]},
    {intuitionStimulus: intuitionStimuliPool[7]},
    {intuitionStimulus: intuitionStimuliPool[8]},
    {intuitionStimulus: intuitionStimuliPool[9]},
    {intuitionStimulus: intuitionStimuliPool[10]},
    {intuitionStimulus: intuitionStimuliPool[11]},
    {intuitionStimulus: intuitionStimuliPool[12]},
    {intuitionStimulus: intuitionStimuliPool[13]},
    {intuitionStimulus: intuitionStimuliPool[14]},
    {intuitionStimulus: intuitionStimuliPool[15]},
    {intuitionStimulus: intuitionStimuliPool[16]},
    {intuitionStimulus: intuitionStimuliPool[17]},
    {intuitionStimulus: intuitionStimuliPool[18]},
    {intuitionStimulus: intuitionStimuliPool[19]},
    {intuitionStimulus: intuitionStimuliPool[20]},
    {intuitionStimulus: intuitionStimuliPool[21]},
    {intuitionStimulus: intuitionStimuliPool[22]},
    {intuitionStimulus: intuitionStimuliPool[23]},
    {intuitionStimulus: intuitionStimuliPool[24]},
    {intuitionStimulus: intuitionStimuliPool[25]},
    {intuitionStimulus: intuitionStimuliPool[26]},
    {intuitionStimulus: intuitionStimuliPool[27]},
    {intuitionStimulus: intuitionStimuliPool[28]},
    {intuitionStimulus: intuitionStimuliPool[29]},
    {intuitionStimulus: intuitionStimuliPool[30]},
    {intuitionStimulus: intuitionStimuliPool[31]},
    {intuitionStimulus: intuitionStimuliPool[32]},
    {intuitionStimulus: intuitionStimuliPool[33]},
    {intuitionStimulus: intuitionStimuliPool[34]},
    {intuitionStimulus: intuitionStimuliPool[35]},
];

// Intuition triad
let intuitionTriad = {
    type: 'image-keyboard-response',
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

// Add 'high' to high fluency stimuli pool
highFluencyStimuliPool = addPostfix(postfix = '_high',
    stimuli = highFluencyStimuliPool);

// Take 9 coherence stimuli to the low fluency stimuli pool
let lowFluencyStimuliPool =
    jsPsych.randomization.sampleWithoutReplacement(coherenceStimuliPool, 9);

// Add 9 incoherence stimuli to low fluency stimuli pool
lowFluencyStimuliPool.push(...jsPsych.randomization.sampleWithoutReplacement(
        incoherenceStimuliPool, 9));

// Add 'low' to high fluency stimuli pool
lowFluencyStimuliPool = addPostfix(postfix = '_low',
    stimuli = lowFluencyStimuliPool);

// Add high and low fluency stimuli to fluency pool
let fluencyStimuliPool = [];
fluencyStimuliPool.push(...highFluencyStimuliPool);
fluencyStimuliPool.push(...lowFluencyStimuliPool);

// Add r, g, b
fluencyStimuliPool = addRGB(fluencyStimuliPool);

// Add file ending to fluency stimuli
fluencyStimuliPool = addPostfix(postfix = '.png',
    stimuli = fluencyStimuliPool);

// Add image directory
fluencyStimuliPool = addPrefix(prefix = 'img/',
    stimuli = fluencyStimuliPool);

// Fluency stimuli
let fluencyStimuli = [
    {fluencyStimulus: fluencyStimuliPool[0]},
    {fluencyStimulus: fluencyStimuliPool[1]},
    {fluencyStimulus: fluencyStimuliPool[2]},
    {fluencyStimulus: fluencyStimuliPool[3]},
    {fluencyStimulus: fluencyStimuliPool[4]},
    {fluencyStimulus: fluencyStimuliPool[5]},
    {fluencyStimulus: fluencyStimuliPool[6]},
    {fluencyStimulus: fluencyStimuliPool[7]},
    {fluencyStimulus: fluencyStimuliPool[8]},
    {fluencyStimulus: fluencyStimuliPool[9]},
    {fluencyStimulus: fluencyStimuliPool[10]},
    {fluencyStimulus: fluencyStimuliPool[11]},
    {fluencyStimulus: fluencyStimuliPool[12]},
    {fluencyStimulus: fluencyStimuliPool[13]},
    {fluencyStimulus: fluencyStimuliPool[14]},
    {fluencyStimulus: fluencyStimuliPool[15]},
    {fluencyStimulus: fluencyStimuliPool[16]},
    {fluencyStimulus: fluencyStimuliPool[17]},
    {fluencyStimulus: fluencyStimuliPool[18]},
    {fluencyStimulus: fluencyStimuliPool[19]},
    {fluencyStimulus: fluencyStimuliPool[20]},
    {fluencyStimulus: fluencyStimuliPool[21]},
    {fluencyStimulus: fluencyStimuliPool[22]},
    {fluencyStimulus: fluencyStimuliPool[23]},
    {fluencyStimulus: fluencyStimuliPool[24]},
    {fluencyStimulus: fluencyStimuliPool[25]},
    {fluencyStimulus: fluencyStimuliPool[26]},
    {fluencyStimulus: fluencyStimuliPool[27]},
    {fluencyStimulus: fluencyStimuliPool[28]},
    {fluencyStimulus: fluencyStimuliPool[29]},
    {fluencyStimulus: fluencyStimuliPool[30]},
    {fluencyStimulus: fluencyStimuliPool[31]},
    {fluencyStimulus: fluencyStimuliPool[32]},
    {fluencyStimulus: fluencyStimuliPool[33]},
    {fluencyStimulus: fluencyStimuliPool[34]},
    {fluencyStimulus: fluencyStimuliPool[35]},
];

// Fluency triad
let fluencyTriad = {
    type: 'image-keyboard-response',
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

// 12 coherence stimuli
coherenceStimuliPool = createStimuliPool(poolSize = 12);
coherenceStimuliPool = addPrefix(prefix = 'koh_',
    stimuli = coherenceStimuliPool);

// 12 incoherence stimuli
incoherenceStimuliPool = createStimuliPool(poolSize = 12);
incoherenceStimuliPool = addPrefix(prefix = 'ink_',
    stimuli = incoherenceStimuliPool);

// Add 12 coherence and 12 incoherence stimuli to the negative stimuli pool
let negativeStimuliPool = [];
negativeStimuliPool.push(...coherenceStimuliPool);
negativeStimuliPool.push(...incoherenceStimuliPool);

// Add 'neg' to the negative stimuli pool
negativeStimuliPool = addPostfix(postfix = '_neg',
    stimuli = negativeStimuliPool);

// Add 12 coherence and 12 incoherence stimuli to the positive stimuli pool
let positiveStimuliPool = [];
positiveStimuliPool.push(...coherenceStimuliPool);
positiveStimuliPool.push(...incoherenceStimuliPool);

// Add 'pos' to the positive stimuli pool
positiveStimuliPool = addPostfix(postfix = '_pos',
    stimuli = positiveStimuliPool);

// Add negative and positive stimuli to the affective stimuli pool
let affectiveStimuliPool = [];
affectiveStimuliPool.push(...negativeStimuliPool);
affectiveStimuliPool.push(...positiveStimuliPool);

// Replace individual stimuli
affectiveStimuliPool.splice(affectiveStimuliPool.indexOf('ink_12_neg'), 1,
    'ink_13_neg');
affectiveStimuliPool.splice(affectiveStimuliPool.indexOf('koh_09_neg'), 1,
    'koh_13_neg');
affectiveStimuliPool.splice(affectiveStimuliPool.indexOf('koh_10_neg'), 1,
    'koh_14_neg');

console.log(affectiveStimuliPool);

// Add file ending to affective stimuli
affectiveStimuliPool = addPostfix(postfix = '.png',
    stimuli = affectiveStimuliPool);

// Add image directory
affectiveStimuliPool = addPrefix(prefix = 'img/',
    stimuli = affectiveStimuliPool);

// Affective stimuli
let affectiveStimuli = [
    {affectiveStimulus: affectiveStimuliPool[0]},
    {affectiveStimulus: affectiveStimuliPool[1]},
    {affectiveStimulus: affectiveStimuliPool[2]},
    {affectiveStimulus: affectiveStimuliPool[3]},
    {affectiveStimulus: affectiveStimuliPool[4]},
    {affectiveStimulus: affectiveStimuliPool[5]},
    {affectiveStimulus: affectiveStimuliPool[6]},
    {affectiveStimulus: affectiveStimuliPool[7]},
    {affectiveStimulus: affectiveStimuliPool[8]},
    {affectiveStimulus: affectiveStimuliPool[9]},
    {affectiveStimulus: affectiveStimuliPool[10]},
    {affectiveStimulus: affectiveStimuliPool[11]},
    {affectiveStimulus: affectiveStimuliPool[12]},
    {affectiveStimulus: affectiveStimuliPool[13]},
    {affectiveStimulus: affectiveStimuliPool[14]},
    {affectiveStimulus: affectiveStimuliPool[15]},
    {affectiveStimulus: affectiveStimuliPool[16]},
    {affectiveStimulus: affectiveStimuliPool[17]},
    {affectiveStimulus: affectiveStimuliPool[18]},
    {affectiveStimulus: affectiveStimuliPool[19]},
    {affectiveStimulus: affectiveStimuliPool[20]},
    {affectiveStimulus: affectiveStimuliPool[21]},
    {affectiveStimulus: affectiveStimuliPool[22]},
    {affectiveStimulus: affectiveStimuliPool[23]},
    {affectiveStimulus: affectiveStimuliPool[24]},
    {affectiveStimulus: affectiveStimuliPool[25]},
    {affectiveStimulus: affectiveStimuliPool[26]},
    {affectiveStimulus: affectiveStimuliPool[27]},
    {affectiveStimulus: affectiveStimuliPool[28]},
    {affectiveStimulus: affectiveStimuliPool[29]},
    {affectiveStimulus: affectiveStimuliPool[30]},
    {affectiveStimulus: affectiveStimuliPool[31]},
    {affectiveStimulus: affectiveStimuliPool[32]},
    {affectiveStimulus: affectiveStimuliPool[33]},
    {affectiveStimulus: affectiveStimuliPool[34]},
    {affectiveStimulus: affectiveStimuliPool[35]},
    {affectiveStimulus: affectiveStimuliPool[36]},
    {affectiveStimulus: affectiveStimuliPool[37]},
    {affectiveStimulus: affectiveStimuliPool[38]},
    {affectiveStimulus: affectiveStimuliPool[39]},
    {affectiveStimulus: affectiveStimuliPool[40]},
    {affectiveStimulus: affectiveStimuliPool[41]},
    {affectiveStimulus: affectiveStimuliPool[42]},
    {affectiveStimulus: affectiveStimuliPool[43]},
    {affectiveStimulus: affectiveStimuliPool[44]},
    {affectiveStimulus: affectiveStimuliPool[45]},
    {affectiveStimulus: affectiveStimuliPool[46]},
    {affectiveStimulus: affectiveStimuliPool[47]},
];

// Affective triad
let affectiveTriad = {
    type: 'image-keyboard-response',
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


/*
    Functions
*/

/**
* Add postfix to stimuli
* @param {sting} postfix postfix to be added to the stimuli
* @param {array} stimuli stimuli pool input
*
* @return {array} array of stimuli
*/
function addPostfix(postfix, stimuli) {
    let stimuliPool = [];
    let stimulus;
    for (stim of stimuli) {
        stimulus = stim + postfix;
        stimuliPool.push(stimulus);
    }
    return stimuliPool;
}

/**
* Add prefix to stimuli
* @param {sting} prefix prefix to be added to the stimuli
* @param {array} stimuli stimuli pool input
*
* @return {array} array of stimuli
*/
function addPrefix(prefix, stimuli) {
    let stimuliPool = [];
    let stimulus;
    for (stim of stimuli) {
        stimulus = prefix + stim;
        stimuliPool.push(stimulus);
    }
    return stimuliPool;
}

/**
 * Add either 'r', 'g', or 'b' to all fluency stimuli
 * @param {array} stimuli array of stimuli
 *
 * @return {array} array of sound files
 */
function addRGB(stimuli) {
    let stimuliPool = [];
    let stimulus;
    let counter = 1;
    for (stim of stimuli) {
        if (counter % 3 == 0) {
            stimulus = stim + '_r';
        } else if (counter % 3 == 1) {
            stimulus = stim + '_g';
        } else {
            stimulus = stim + '_b';
        }
            stimuliPool.push(stimulus);
        counter += 1;
    }
return stimuliPool;
}

/**
* Create stimuli pool
* @param {num} poolSize number of stimuli to be created
*
* @return {array} array of stimuli
*/
function createStimuliPool(poolSize) {
    let numArray = [];
    let stimuliPool = [];
    let stimulus;
    for (let i = 1; i <= poolSize; i++) {
        numArray.push(i);
    }
    for (num of numArray) {
        stimulus = ('0' + num).slice(-2);
        stimuliPool.push(stimulus);
    }
    return stimuliPool;
}
