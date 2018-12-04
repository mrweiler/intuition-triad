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
        'First page with instructions',
        'Second page with instructions',
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
        'First page with instructions',
        'Second page with instructions',
        ],
    show_clickable_nav: true,
 };

// practice block
let practiceBlock = {
    timeline: [practiceBlockInstructions],
  };


// Main
jsPsych.init({
      timeline: [instructions, practiceBlock],
    });
