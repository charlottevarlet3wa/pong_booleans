export default class Paddle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "paddle");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setImmovable(true);
    this.body.setSize(10, 105); // Taille de la hitbox
    this.body.setOffset(12, 12); // Décalage de la hitbox
    this.setCollideWorldBounds(true);
  }

  // Déplacer la raquette en fonction des touches pressées
  move(upKey, downKey) {
    if (upKey.isDown) {
      this.setVelocityY(-600);
    } else if (downKey.isDown) {
      this.setVelocityY(600);
    } else {
      this.setVelocityY(0);
    }
  }
}
