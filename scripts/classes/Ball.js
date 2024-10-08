export default class Ball extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "ball");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setBounce(1, 1);
    this.body.setSize(20, 23);
    this.body.setOffset(12, 12);

    this.defaultSpeed = 200;
    this.isInBasket = false;
  }

  launch(speedMultiplier) {
    const speed = this.defaultSpeed * speedMultiplier;
    const randomX = speed * Phaser.Math.RND.sign();
    const randomY = speed * Phaser.Math.RND.sign();
    this.setVelocity(randomX, randomY);
  }

  reset() {
    this.setPosition(400, 200);
    this.setVelocity(0, 0);
    this.isInBasket = false;
  }

  onPaddleHit(paddle) {
    const paddleHeight = paddle.displayHeight;
    const impactY = this.y - paddle.y;
    const proportion = (impactY + paddleHeight / 2) / paddleHeight;

    const maxBounceAngle = Math.PI / 3;
    const bounceAngle = (proportion - 0.5) * 2 * maxBounceAngle;

    const speed = this.defaultSpeed;
    const newVelocityY = speed * Math.sin(bounceAngle);

    this.setVelocityY(newVelocityY);
  }

  setDifficulty(difficulty) {
    switch (difficulty) {
      case "easy":
        this.defaultSpeed = 200;
        break;
      case "medium":
        this.defaultSpeed = 400;
        break;
      case "hard":
        this.defaultSpeed = 600;
        break;
      default:
        this.defaultSpeed = 200;
        break;
    }
  }
}
