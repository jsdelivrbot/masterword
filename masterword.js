root.setCanvasById("JamesCanvas");

root.size = [256, 512];

root.guesses = [];
LETTERS_IN_ANSWER = 4;
MAX_GUESSES = 10;

SIZE_BLANK = [24, 32];
SIZE_CLUE = [24, 24];

INDENT = [8, 8];

TitlePanel = newTemplate({
	pos: [INDENT[0], INDENT[1]],
	size: [root.size[0] - 2 * INDENT[0], 80],
	source: SRC_PANEL_TITLE,
	
	draw: function() {
		this.drawText("Masterword", {
			pos: [this.size[0] / 2, 28],
			font: "32px monospace",
			align: ALIGN_CENTER,
			baseline: "middle"
		});
		this.drawText("Made by hPerks", {
			pos: [this.size[0] / 2, 54],
			font: "16px monospace",
			align: ALIGN_CENTER,
			baseline: "middle"
		});
	}
});

BlanksPanelButton = newTemplate({
	size: [32, 32],
  source: SRC_BUTTON,
  animSpeed: 0,

  update: function() {
    if (v2Greater2(this.mouse(), [0,0]) && v2Greater2(this.size, this.mouse())) {
      this.frame = 1;
    } else {
      this.frame = 0;
    }

    if (root.blanksPanel.input.length != LETTERS_IN_ANSWER && !(root.didWin || root.isGameOver)) {
      this.frame = 2;
    } else if (pressed(M_LEFT) && v2Greater2(this.mouse(), [0,0]) && v2Greater2(this.size, this.mouse())) {
      this.onPress();
    }
  },

  onPress: function() {
    if (root.didWin || root.isGameOver) {
      root.onStart();
    } else if (root.blanksPanel.input.length == LETTERS_IN_ANSWER) {
      root.guess(root.blanksPanel.input);
      root.blanksPanel.input = "";
    }
  },

  draw: function () {
    if (root.didWin || root.isGameOver) {
      this.drawImage(SRC_BUTTON_RESTART, {});
    } else {
      this.drawImage(SRC_BUTTON_GUESS, {});
    }
  }
})

BlanksPanel = newTemplate({
	pos: [INDENT[0], TitlePanel.pos[1] + TitlePanel.size[1] + INDENT[1]],
  size: [root.size[0] - 2 * INDENT[0], 80],
	source: SRC_PANEL_BLANKS,
  input: "",
  button: null,
	
	init: function() {
		this.BLANKS_POSITION_LEFT = this.size[0] / 2 - (4 * SIZE_BLANK[0] + INDENT[0] + BlanksPanelButton.size[0]) / 2;
		this.HEADER_HEIGHT = (this.size[1] - SIZE_BLANK[1]) / 2;
		this.FOOTER_HEIGHT = (this.size[1] - SIZE_BLANK[1]) / 2;
		
		this.button = this.new({
			pos: [this.BLANKS_POSITION_LEFT + 4 * SIZE_BLANK[0] + INDENT[0], this.HEADER_HEIGHT]
		}, BlanksPanelButton);
	},

  update: function() {
		if (!root.didWin && !root.isGameOver) {
			for (var i = 65; i < 91; i++) {
				if (pressed(i)) {
					this.input += String.fromCharCode(i);
				}
			}
			if (pressed(K_BACKSPACE) && this.input.length > 0) {
				this.input = this.input.substring(0, this.input.length-1);
			}

			if (this.input.length > LETTERS_IN_ANSWER) {
				this.input = this.input.substring(0, LETTERS_IN_ANSWER);
			}
		}

    if (pressed(K_ENTER)) {
      this.button.onPress();
    }
  },

  draw: function() {
    for (var i = 0; i < LETTERS_IN_ANSWER; i++) {
      var blankPos = [this.BLANKS_POSITION_LEFT + SIZE_BLANK[0] * i, this.HEADER_HEIGHT];
			var image = SRC_BLANK_EMPTY;
			if (!root.didWin && !root.isGameOver) {
				if (this.input.length > i) {
					image = SRC_BLANK_FULL;
				} else if (this.input.length == i) {
					image = SRC_BLANK_ACTIVE;
				} else {
					image = SRC_BLANK_EMPTY;
				}
			}
			
			this.drawImage(image, {
				pos: blankPos
			});
			
			if (this.input.length > i) {
				this.drawText(this.input[i], {
					pos: v2Add(blankPos, v2Div(SIZE_BLANK, 2)),
					font: "16px monospace",
					align: ALIGN_CENTER,
					baseline: "middle"
				});
			}
    }

    if (root.wasLastGuessInvalid) {
      this.drawText("Invalid guess.", {
        pos: [this.size[0] / 2, this.HEADER_HEIGHT + SIZE_BLANK[1] + this.FOOTER_HEIGHT / 2],
        font: "12px monospace",
        align: ALIGN_CENTER,
        baseline: "middle",
        col: "#FF0000"
      });
    } else if (root.didWin) {
      this.drawText("You guessed it!", {
        pos: [this.size[0] / 2, this.HEADER_HEIGHT + SIZE_BLANK[1] + this.FOOTER_HEIGHT / 2],
        font: "12px monospace",
        align: ALIGN_CENTER,
        baseline: "middle",
        col: "#009900"
      });
    } else if (root.isGameOver) {
      this.drawText("Out of guesses!", {
        pos: [this.size[0] / 2, this.HEADER_HEIGHT + SIZE_BLANK[1] + this.FOOTER_HEIGHT / 2],
        font: "12px monospace",
        align: ALIGN_CENTER,
        baseline: "middle",
        col: "#FF0000"
      });
    }
  }
});

GuessesPanel = newTemplate({
	pos: [INDENT[0], BlanksPanel.pos[1] + BlanksPanel.size[1] + INDENT[1]],
  size: [root.size[0] - 2 * INDENT[0], 320],
	source: SRC_PANEL_GUESSES,
	
	init: function() {
		this.INDENT_LEFT = this.size[0] / 2 - LETTERS_IN_ANSWER * SIZE_BLANK[0];
		this.HEADER_HEIGHT = 48;
		this.FOOTER_HEIGHT = this.size[1] - this.HEADER_HEIGHT - MAX_GUESSES * SIZE_CLUE[1];
		
		console.log(this.INDENT_LEFT + ", " + this.HEADER_HEIGHT);
	},

  draw: function() {
    this.drawText("Guesses", {
      pos: [this.size[0] / 2, this.HEADER_HEIGHT / 2],
      font: "24px monospace",
      align: ALIGN_CENTER,
      baseline: "middle"
    });

    this.drawImage(SRC_GUESSES_BACKGROUND, {
      pos: [this.INDENT_LEFT, this.HEADER_HEIGHT]
    })

    for (var i = 0; i < root.guesses.length; i++) {
      var guessPosY = this.HEADER_HEIGHT + i * SIZE_CLUE[1];

      this.drawText(root.guesses[i], {
        pos: [this.size[0] / 4, guessPosY + SIZE_CLUE[1] / 2],
        font: "16px monospace",
        align: ALIGN_CENTER,
        baseline: "middle"
      });

      var clues = root.cluesForGuess(root.guesses[i]);

      if (clues.blacks == 0 && clues.whites == 0) {
        this.drawImage(SRC_NO_MATCHES, {
          pos: [this.size[0] / 2, guessPosY]
        });
      } else {
        var nextCluePosX = this.size[0] / 2;
        for (var j = 0; j < clues.blacks; j++) {
          this.drawImage(SRC_BLACK, {
            pos: [nextCluePosX, guessPosY]
          });
          nextCluePosX += SIZE_CLUE[0];
        }

        for (var j = 0; j < clues.whites; j++) {
          this.drawImage(SRC_WHITE, {
            pos: [nextCluePosX, guessPosY]
          });
          nextCluePosX += SIZE_CLUE[0];
        }
      }
    }

		if (root.didWin || root.isGameOver) {
			this.drawText("Answer: " + root.answer, {
				pos: [this.size[0] / 2, this.size[1] - this.FOOTER_HEIGHT / 2],
				font: "20px monospace",
				align: ALIGN_CENTER,
				baseline: "middle",
				col: root.didWin ? "#009900" : "#FF0000"
			})
		}
	}
});

root.draw = function() {
	this.drawImage(SRC_PANEL_ROOT, {});
}

root.wasLastGuessInvalid = false;
root.didWin = false;
root.isGameOver = false;

root.cluesForGuess = function(guess) {
  var totalWhites = 0;
  var totalBlacks = 0;

  for (var i = 0; i < 26; i++) {
    var letter = ALPHABET.charAt(i);
    if (guess.indexOf(letter) > -1 && this.answer.indexOf(letter) > -1) {
      var clues = Math.min(this.answer.count(letter), guess.count(letter));

      var blacks = 0;
      for (var j = 0; j < this.answer.length; j++) {
        if (guess.charAt(j) == letter && this.answer.charAt(j) == letter) {
          blacks += 1;
        }
      }

      var whites = clues - blacks;

      totalWhites += whites;
      totalBlacks += blacks;
    }
  }

  return {whites: totalWhites, blacks: totalBlacks};
}

root.onStart = function() {
  this.answer = POSSIBLE_ANSWERS[Math.floor(Math.random() * POSSIBLE_ANSWERS.length)];
  this.guesses = [];

  this.didWin = false;
  this.wasLastGuessInvalid = false;
  this.isGameOver = false;
}

root.guess = function(guess) {
  if (POSSIBLE_GUESSES.indexOf(guess) > -1) {
    this.wasLastGuessInvalid = false;
    this.guesses.push(guess);

    if (guess == this.answer) {
      this.didWin = true;
    } else if (this.guesses.length == MAX_GUESSES) {
      this.isGameOver = true;
    }
  } else {
    this.wasLastGuessInvalid = true;
  }
}

root.titlePanel = root.new({}, TitlePanel);
root.blanksPanel = root.new({}, BlanksPanel);
root.guessesPanel = root.new({}, GuessesPanel);

root.onStart();
startJames();
