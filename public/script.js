// ---------- PUZZLES ---------- //
const puzzles = [
  {
    setup:
      "There was a cook who always makes the perfect meal for the mansion, yet he never gets to eat his own food? Why?",
    solution:
      "The master’s favorite food was carrot, which the chef was allergic to, so he never ate the food he made in this mansion.",
  },
];

// ---------- PROMPT BUILDER  ---------- //
const evaluationPrompt = (setup, solution, userInput, history) => `
  You are an AI called Eva assisting in a puzzle game. 
  You speak in a calm, thoughtful yet mysterious manner.

  The current puzzle for the player to guess is: ${setup}
  The answer is: ${solution}

  The player's previous guesses so far are:
  ${history && history.length ? history.join(", ") : "(none yet)"}

  You should respond to the player’s guesses with only "yes", "no", or "doesn't relate".
  If the player asks something unrelated to the puzzle say "doesn't relate".
  If the player answers correctly say: That's Correct!

  After responding with "yes," "no," or "doesn't relate," add a very short, gentle nudge that guides them closer to the answer without revealing it.

  Allow misspellings.
  Be an easy judge on the player's answer.

  The player's current guess is: ${userInput}
`;

// ---------- ENDING TEXT ---------- //
const evaEnding =
  "\nPress 'Ready to Guess' button to enter your final answer!\n";

// ---------- FLOW CONTROL ---------- //
let currentPuzzleIndex = 0;

const loadPuzzle = function () {
  if (currentPuzzleIndex >= puzzles.length) {
    this.echo("");
    this.echo(evaEnding);
    return;
  }

  const puzzle = puzzles[currentPuzzleIndex];
  this.echo("");
  // this.echo(puzzle.setup); // shown by playPuzzle

  playPuzzle
    .bind(this)(puzzle)
    .then(() => {
      // After solving a puzzle, ask if the user wants to continue
      this.echo("");
      this.push(
        function (command) {
          if (command.match(/yes|y/i)) {
            currentPuzzleIndex++; // Move to the next puzzle
            this.pop(); // Remove this prompt from the stack
            loadPuzzle.call(this);
          } else if (command.match(/no|n/i)) {
            this.echo(evaEnding);
            this.pop();
          } else {
            this.echo("Please enter yes or no. (y/n)");
          }
        },
        {
          prompt: "Are you ready for entering your final answer? (y/n) > ",
        }
      );
    });
};

// ---------- TERMINAL ---------- //
const term = $("#commandDiv").terminal(
  {
    start: async function () {
      loadPuzzle.call(this);
    },
  },
  {
    greetings: `
Game Rule: 
  * I will present a scenario.
  * Your goal is to solve the puzzle by using the clues in the scenario and asking me questions.
  * You can ask me any question related to the scenario, but I can only answer with "Yes," "No," or "Doesn't relate."
  
With the rule stated.. let's start :)
  `,
  }
);

// Auto-run "start" shortly after init
setTimeout(() => {
  term.exec("start");
}, 1000);

// ---------- UI TOGGLE (optional) ---------- //
let showInputUI = false;
function toggleCommandDivVisibility() {
  const commandDiv = document.getElementById("commandDiv");
  if (!commandDiv) return;
  commandDiv.style.display = showInputUI ? "block" : "none";
}
toggleCommandDivVisibility();

// ---------- AI LOOP ---------- //
async function playPuzzle(puzzle) {
  this.echo(puzzle.setup);
  this.echo("");
  this.echo(`Ask any question related to the scenario`);
  this.echo("");

  const terminal = this;
  const history = []; // store all previous guesses for context

  // Main player Q/A loop
  while (true) {
    const userInput = await new Promise((resolve) => {
      terminal.push(
        function (input) {
          resolve(input);
        },
        { prompt: "> " }
      );
    });

    history.push(userInput);

    // Pass history to the AI
    const aiResponse = await requestAI(
      userInput,
      puzzle.setup,
      puzzle.solution,
      history
    );

    terminal.echo(`
Eva
  ${aiResponse}

    `);

    if (aiResponse.trim() === "That's Correct!") {
      terminal.pop();
      break;
    }
  }
}

// ---------- SERVER REQUEST ---------- //
async function requestAI(input, setup, solution, history) {
  console.log(`--requestAI started --input: ${input}`);

  const prompt = evaluationPrompt(setup, solution, input, history);

  const response = await fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: prompt }),
  });

  if (!response.ok) {
    const txt = await response.text().catch(() => "");
    console.error("Submit failed:", response.status, txt);
    return `Error in submitting data. (${response.status})`;
  }

  const jsonData = await response.json();
  return jsonData.ai ?? "(no ai field)";
}
