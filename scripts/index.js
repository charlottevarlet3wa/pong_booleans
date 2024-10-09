import GameScene from "./classes/GameScene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 400,
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      // debug: true,
    },
  },
  scene: GameScene,
  parent: "game-container",
};
const game = new Phaser.Game(config);

// Écoute pour valider à la fois la difficulté de la balle et des questions
document
  .getElementById("set-difficulty")
  .addEventListener("click", function () {
    document.querySelector(".panel").style.display = "none";

    // Récupérer la difficulté de la balle
    const selectedBallDifficulty = document.querySelector(
      'input[name="ball-difficulty"]:checked'
    ).value;
    console.log(
      `Difficulté de la balle sélectionnée : ${selectedBallDifficulty}`
    );

    // Récupérer la difficulté des questions
    const selectedQuestionDifficulty = document.querySelector(
      'input[name="question-difficulty"]:checked'
    ).value;
    console.log(
      `Difficulté des questions sélectionnée : ${selectedQuestionDifficulty}`
    );

    // Mettre à jour la difficulté de la balle et des questions dans la scène active
    game.scene.scenes[0].setBallDifficulty(selectedBallDifficulty);
    game.scene.scenes[0].setQuestionDifficulty(
      parseInt(selectedQuestionDifficulty)
    );
  });
