export default class Basket extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, isTrue) {
    // Créer le panier comme un simple cercle (sans image)
    const color = isTrue ? 0x00ff00 : 0xcd1316;
    const radius = 50;

    const basketCircle = scene.add.circle(x, y, radius, color).setAlpha(0.5); // Cercle semi-transparent
    scene.physics.add.existing(basketCircle, true); // Créer un body physique statique

    // Utiliser un body circulaire pour la collision
    basketCircle.body.setCircle(radius);
    basketCircle.isTrue = isTrue; // Ajouter la propriété isTrue pour la logique de jeu

    return basketCircle; // Retourner le cercle à la place de l'image d'origine
  }
}
