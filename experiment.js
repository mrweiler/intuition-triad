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


// Main
jsPsych.init({
      timeline: [instructions],
    });
