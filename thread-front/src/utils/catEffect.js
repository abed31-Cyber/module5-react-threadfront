// Utilitaire pour déclencher le son et l’animation de griffe lors d’un toast d’erreur chat
/**
 * Déclenche l'effet chat avec un son spécifique selon le type d'erreur
 * @param {string} soundName - nom du fichier son à jouer (dans /public/asset/)
 */
export function triggerCatErrorEffect(soundName = '') {
  const event = new CustomEvent('cat-claw-show', { detail: { soundName } });
  window.dispatchEvent(event);
}
