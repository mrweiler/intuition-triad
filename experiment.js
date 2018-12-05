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

// Left side practice
let practiceLeftSide = {
    type: 'html-keyboard-response',
    stimulus: '<div class="left">!</div>',
    choices: ['s', 'l'],
    trial_duration: 2000,
  };

// Right side practice
let practiceRightSide = {
    type: 'html-keyboard-response',
    stimulus: '<div class="right">!</div>',
    choices: ['s', 'l'],
    trial_duration: 2000,
  };

 // Practice trials
let practiceTrials = {
    timeline: [practiceLeftSide, practiceRightSide],
    repetitions: 10,
    randomize_order: true,
  };

// practice block
let practiceBlock = {
    timeline: [practiceBlockInstructions, practiceTrials],
  };


// Main
jsPsych.init({
      timeline: [instructions, practiceBlock],
    });
