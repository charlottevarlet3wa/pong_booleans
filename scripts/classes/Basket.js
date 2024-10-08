export default class Basket extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, isTrue) {
    super(scene, x, y, isTrue ? "basketTrue" : "basketFalse");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setImmovable(true);

    // Ajouter une hitbox circulaire pour le panier
    const radius = 40;
    this.body.setCircle(radius);
    this.body.setOffset(10, 10);

    this.isTrue = isTrue;
  }
}
