export default class Question {
  constructor(scene, elementId, difficulty = 0) {
    // Référence à l'élément HTML pour afficher la question
    this.element = document.getElementById(elementId);

    // Charger les questions à partir du fichier JSON
    this.loadQuestions().then(() => {
      // Définit la difficulté (0 par défaut)
      this.difficulty = difficulty;

      // Choisir une question aléatoirement dans le tableau correspondant à la difficulté
      this.changeQuestion();
    });
  }

  // Charger les questions à partir du fichier JSON
  async loadQuestions() {
    const response = await fetch("./public/data/questions.json");
    this.questions = await response.json();
  }

  // Méthode pour changer de question aléatoirement en fonction de la difficulté
  changeQuestion() {
    // S'assurer que les questions sont chargées
    if (!this.questions) return;

    // Sélectionner une question aléatoire du tableau correspondant à la difficulté
    const questionSet = this.questions[this.difficulty];
    const randomQuestion = Phaser.Math.RND.pick(questionSet);

    // Mettre à jour la question et la réponse attendue
    this.question = randomQuestion.question;
    this.expectedValue = randomQuestion.answer;

    // Mettre à jour l'affichage de la question
    this.updateQuestion();
  }

  // Méthode pour mettre à jour l'affichage du texte en fonction de la question actuelle
  updateQuestion() {
    this.element.innerText = `${this.question}`;
  }

  // Méthode pour vérifier si le bon panier est passé
  isCorrectBasket(basket) {
    return basket.isTrue === this.expectedValue;
  }
}
