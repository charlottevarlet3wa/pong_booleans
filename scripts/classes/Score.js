export default class Score {
  constructor(scene, x, y, initialScore = 0) {
    this.scene = scene;
    this.score = initialScore;
    this.scoreText = this.scene.add.text(x, y, "Score: " + this.score, {
      fontFamily: "Arial", // Remplace par la police de ton choix
      fontSize: "1.2rem", // Taille de la police
      fill: "#FFF", // Couleur du texte
    });
  }

  // Ajouter un point au score
  addPoint() {
    this.score += 1;
    this.updateScoreText();
  }
  // Ajouter un point au score
  losePoint() {
    this.score -= 1;
    this.updateScoreText();
  }

  // Réinitialiser le score
  reset() {
    this.score = 0;
    this.updateScoreText();
  }

  // Mettre à jour le texte affiché
  updateScoreText() {
    this.scoreText.setText("Score: " + this.score);
  }
}
