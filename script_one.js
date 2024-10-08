const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 400,
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      //   debug: true, // Activer le mode debug pour voir les hitboxes
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let playerLeft, playerRight, ball, cursors;
let keys;
let gameStarted = false;

function preload() {
  this.load.image("paddle", "assets/images/paddle_true.png");
  this.load.image("ball", "assets/images/ball.png");
}

function create() {
  // Ajout des raquettes
  playerLeft = this.physics.add
    .sprite(50, this.game.config.height / 2, "paddle")
    .setImmovable();
  playerRight = this.physics.add
    .sprite(750, this.game.config.height / 2, "paddle")
    .setImmovable();

  // Ajustement de la hitbox (réduire la taille et décaler)
  playerLeft.body.setSize(10, 105); // Taille de la hitbox
  playerLeft.body.setOffset(12, 12); // Décalage de la hitbox
  playerLeft.setCollideWorldBounds(true);

  playerRight.body.setSize(10, 105); // Taille de la hitbox
  playerRight.body.setOffset(12, 12); // Décalage de la hitbox
  playerRight.setCollideWorldBounds(true);

  // Ajout de la balle
  ball = this.physics.add.sprite(
    this.game.config.width / 2,
    this.game.config.height / 2,
    "ball"
  );
  ball.body.setSize(20, 23);
  ball.body.setOffset(12, 12);
  ball.setCollideWorldBounds(true);
  ball.setBounce(1, 1);

  // Remettre la balle en pause initialement (pas de vitesse)
  ball.setVelocity(0, 0);

  // Activer la collision entre la balle et les raquettes
  //   this.physics.add.collider(ball, playerLeft);
  //   this.physics.add.collider(ball, playerRight);

  // Activer la collision entre la balle et les raquettes et gérer les collisions
  this.physics.add.collider(ball, playerLeft, onBallHitPaddle, null, this);
  this.physics.add.collider(ball, playerRight, onBallHitPaddle, null, this);

  // Contrôles pour les joueurs
  cursors = this.input.keyboard.createCursorKeys();
  keys = this.input.keyboard.addKeys({
    upLeft: Phaser.Input.Keyboard.KeyCodes.Z,
    downLeft: Phaser.Input.Keyboard.KeyCodes.S,
    upRight: Phaser.Input.Keyboard.KeyCodes.P,
    downRight: Phaser.Input.Keyboard.KeyCodes.M,
    space: Phaser.Input.Keyboard.KeyCodes.SPACE, // Ajout du contrôle pour la touche Espace
  });
}

function update() {
  // Attendre que le joueur appuie sur Espace pour démarrer le jeu
  if (!gameStarted) {
    console.log("game not started");
    if (keys.space.isDown) {
      console.log("space key");
      startGame(); // Démarrer le jeu si la touche espace est pressée
    }
    return; // Ne rien faire tant que le jeu n'a pas commencé
  }
  // Déplacement du joueur gauche
  if (keys.upLeft.isDown) {
    playerLeft.setVelocityY(-600);
  } else if (keys.downLeft.isDown) {
    playerLeft.setVelocityY(600);
  } else {
    playerLeft.setVelocityY(0);
  }

  // Déplacement du joueur droit
  if (keys.upRight.isDown) {
    playerRight.setVelocityY(-600);
  } else if (keys.downRight.isDown) {
    playerRight.setVelocityY(600);
  } else {
    playerRight.setVelocityY(0);
  }

  // Vérifier si la balle sort du terrain pour marquer un point
  if (ball.x < 15 || ball.x > config.width - 15) {
    resetBall();
  }
}

// Fonction pour démarrer le jeu
function startGame() {
  gameStarted = true; // Marquer que le jeu a démarré
  ball.setVelocity(
    600 * Phaser.Math.Between(-1, 1),
    600 * Phaser.Math.Between(-1, 1)
  ); // Lancer la balle
}

function resetBall() {
  ball.setPosition(config.width / 2, config.height / 2);
  // ball.setVelocity(
  //   300 * Phaser.Math.Between(-1, 1),
  //   300 * Phaser.Math.Between(-1, 1)
  // );
  ball.setVelocity(0, 0);
  gameStarted = false;
}

// // Fonction pour calculer la proportion de l'impact sur la raquette
// function onBallHitPaddle(ball, paddle) {
//   const paddleHeight = paddle.displayHeight; // Hauteur du paddle
//   const impactY = ball.y - paddle.y; // Position relative de la balle sur la raquette
//   const proportion = (impactY + paddleHeight / 2) / paddleHeight; // Calcul de la proportion entre 0 et 1

//   // Affichage de la proportion dans la console
//   console.log(`Proportion de l'impact: ${proportion.toFixed(2)}`);

//   // Prochaines étapes, ajuster la trajectoire de la balle en fonction de l'impact si souhaité
// }
function onBallHitPaddle(ball, paddle) {
  const paddleHeight = paddle.displayHeight; // Hauteur du paddle
  const impactY = ball.y - paddle.y; // Position relative de la balle sur la raquette
  const proportion = (impactY + paddleHeight / 2) / paddleHeight; // Calcul de la proportion entre 0 et 1

  // Ajuster la trajectoire du rebond de la balle
  const maxBounceAngle = Math.PI / 3; // Limite maximale de l'angle de rebond (60 degrés)
  const bounceAngle = (proportion - 0.5) * 2 * maxBounceAngle; // Convertir proportion en angle (-maxBounceAngle à +maxBounceAngle)

  const speed = ball.body.speed || 600; // Vitesse de la balle (300 initialement)

  // Calcul des nouvelles vitesses en fonction de l'angle
  const newVelocityX = speed * Math.cos(bounceAngle);
  const newVelocityY = speed * Math.sin(bounceAngle);

  ball.setVelocityY(ball.body.velocity.y > 0 ? -newVelocityY : newVelocityY);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "w") {
    console.log(ball.body.velocity);
  }
});
