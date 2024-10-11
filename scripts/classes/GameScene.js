import Paddle from "./Paddle.js";
import Ball from "./Ball.js";
import Score from "./Score.js";
import Basket from "./Basket.js";
import Question from "./Question.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.isStarted = false;
    this.difficulty = "easy";
    this.pointerAssignments = {}; // Pour assigner chaque pointer à gauche ou droite
    this.questionDifficulty = 0; // Niveau de difficulté par défaut pour les questions
  }

  preload() {
    this.load.image("paddle", "assets/images/paddle_true.png");
    this.load.image("ball", "assets/images/ball.png");
  }

  create() {
    // Créer les raquettes
    this.playerLeft = new Paddle(this, 50, this.game.config.height / 2);
    this.playerRight = new Paddle(this, 750, this.game.config.height / 2);

    // Créer la balle
    this.ball = new Ball(
      this,
      this.game.config.width / 2,
      this.game.config.height / 2
    );
    this.ball.reset();
    this.ball.setDepth(1);

    // Créer les paniers comme cercles
    this.basketTrue = new Basket(this, 400, 300, true); // Panier vert
    this.basketFalse = new Basket(this, 400, 100, false); // Panier rouge

    // Créer une instance de Score
    this.score = new Score(this, 16, 16); // Texte en haut à gauche

    // Créer une instance de Question (le texte sera affiché dans l'élément HTML <p id="question">)
    this.question = new Question(this, "question", this.questionDifficulty);

    // Activer les collisions entre la balle et les raquettes
    this.physics.add.collider(this.ball, this.playerLeft, () => {
      this.ball.onPaddleHit(this.playerLeft);
    });

    this.physics.add.collider(this.ball, this.playerRight, () => {
      this.ball.onPaddleHit(this.playerRight);
    });

    // Activer les collisions entre la balle et les paniers
    this.ball.isInBasket = false; // Ajouter un état booléen pour gérer l'entrée/sortie du panier
    this.physics.add.overlap(
      this.ball,
      this.basketTrue,
      () => this.handleBasketCollision(this.basketTrue),
      null,
      this
    );
    this.physics.add.overlap(
      this.ball,
      this.basketFalse,
      () => this.handleBasketCollision(this.basketFalse),
      null,
      this
    );

    // Contrôles pour les joueurs au clavier
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      upLeft: Phaser.Input.Keyboard.KeyCodes.Z,
      downLeft: Phaser.Input.Keyboard.KeyCodes.S,
      upRight: Phaser.Input.Keyboard.KeyCodes.P,
      downRight: Phaser.Input.Keyboard.KeyCodes.M,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    // Activer le contrôle multitouch
    this.input.addPointer(1); // Permettre plusieurs inputs tactiles
    this.input.on("pointerdown", this.handlePointerDown, this);
    this.input.on("pointermove", this.handlePointerMove, this);
    this.input.on("pointerup", this.handlePointerUp, this); // Libérer le contrôle
  }

  update() {
    // Attendre que le joueur appuie sur Espace ou touche l'écran pour démarrer le jeu
    if (!this.isStarted) {
      if (this.keys.space.isDown) {
        this.start();
      }
    }

    // Déplacer les raquettes avec le clavier
    this.playerLeft.move(this.keys.upLeft, this.keys.downLeft);
    this.playerRight.move(this.keys.upRight, this.keys.downRight);

    // Vérifier si la balle sort du terrain pour marquer un point
    if (this.ball.x < 15 || this.ball.x > this.game.config.width - 15) {
      this.reset(); // Réinitialiser la balle quand elle sort de l'écran
    }
  }

  start() {
    this.isStarted = true;
    this.ball.launch(1); // Lancer la balle avec une vitesse multipliée par 1
  }

  reset() {
    this.ball.reset();
    this.isStarted = false; // Repasser en mode pause (la balle ne bouge pas)
    this.ball.isInBasket = false; // Réinitialiser l'état de collision du panier
  }

  handleBasketCollision(basket) {
    // Si la balle est déjà entrée dans un panier, on ne fait rien
    if (this.ball.isInBasket) return;

    // Détecter la collision à l'entrée dans le panier
    this.ball.isInBasket = true;

    const isCorrect = this.question.isCorrectBasket(basket);

    // Si la réponse est correcte
    if (isCorrect) {
      if (basket.fillColor === 0x00ff00) {
        this.animateCircle(this, basket.x, basket.y, true, 0x00ff00); // Animation cercle filled vert
      } else {
        this.animateCircle(this, basket.x, basket.y, true, 0xff0000); // Animation cercle filled rouge
      }
    } else {
      // Réponse incorrecte, animation avec stroke (contour)
      this.animateCircle(this, basket.x, basket.y, false, basket.fillColor);
    }

    this.scorePoint(this.ball, basket);
  }

  animateCircle(scene, x, y, filled, color) {
    if (filled) {
      // Cercle filled
      const bridgeCircle = scene.add.circle(x, y, 1, color);
      scene.tweens.add({
        targets: bridgeCircle,
        radius: 50,
        duration: 800,
        ease: "Cubic.easeOut",
        onComplete: () => {
          scene.tweens.add({
            targets: bridgeCircle,
            alpha: 0,
            duration: 350,
            onComplete: () => {
              bridgeCircle.destroy();
            },
          });
        },
      });
    } else {
      // Cercle stroke (contour)
      const bridgeStrokeCircle = scene.add
        .circle(x, y, 1)
        .setStrokeStyle(5, color);
      scene.tweens.add({
        targets: bridgeStrokeCircle,
        radius: 50,
        duration: 800,
        ease: "Cubic.easeOut",
        onComplete: () => {
          scene.tweens.add({
            targets: bridgeStrokeCircle,
            alpha: 0,
            duration: 350,
            onComplete: () => {
              bridgeStrokeCircle.destroy();
            },
          });
        },
      });
    }
  }

  scorePoint(ball, basket) {
    if (this.question.isCorrectBasket(basket)) {
      this.score.addPoint();
      this.question.changeQuestion();
    } else {
      this.score.losePoint();
    }

    // Réinitialiser l'état de collision du panier après un délai
    this.time.delayedCall(800, () => {
      ball.isInBasket = false;
    });
  }

  // Méthode pour changer la difficulté des questions
  setQuestionDifficulty(level) {
    this.difficulty = level;
    this.question.difficulty = level; // Met à jour la difficulté dans la classe `Question`
    this.question.changeQuestion(); // Recharger une nouvelle question
  }

  // Méthode pour changer la difficulté de la balle
  setBallDifficulty(difficulty) {
    this.ball.setDifficulty(difficulty);
  }

  handlePointerDown(pointer) {
    if (!this.isStarted) {
      this.start();
      return;
    }

    // Assigner le pointer à gauche ou à droite
    this.pointerAssignments[pointer.id] =
      pointer.x < this.game.config.width / 2 ? "left" : "right";

    this.updatePaddlePosition(pointer);
  }

  handlePointerMove(pointer) {
    this.updatePaddlePosition(pointer);
  }

  handlePointerUp(pointer) {
    delete this.pointerAssignments[pointer.id]; // Libérer le contrôle du paddle
  }

  updatePaddlePosition(pointer) {
    const side = this.pointerAssignments[pointer.id];

    if (side === "left" && pointer.x < this.game.config.width / 2) {
      this.playerLeft.setY(pointer.y);
    } else if (side === "right" && pointer.x >= this.game.config.width / 2) {
      this.playerRight.setY(pointer.y);
    }
  }
}
