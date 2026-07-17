// src/services/notificationMapping.js
//
// notification-service classe les notifications par domaine métier
// (NotificationType : COMMANDE, PAIEMENT, CERTIFICATION, MESSAGE, AVIS,
// SIGNALEMENT, COMPTE, SYSTEME) et stocke titre + contenu séparément.
//
// Le frontend (NotificationsCenter.jsx, NavigationConsole.jsx) a été
// conçu avant l'existence du backend et attend un format différent :
// utilisateurId, un "type" visuel (info | success | warning | error)
// utilisé pour l'icône/la couleur/les onglets, un champ message unique,
// et dateCreation. Ce fichier fait le pont entre les deux, comme
// certificationMapping.js / commandeMapping.js le font pour leurs domaines.
//
// ATTENTION (point à valider avec Reina) : le backend ne stocke aucune
// notion de "gravité" (succès/alerte/erreur/info), seulement un domaine
// métier. La correspondance NOTIFICATION_TYPE_TO_SEVERITY ci-dessous est
// donc une approximation par défaut : elle permet de conserver les
// mêmes onglets/couleurs dans NotificationsCenter, mais deux
// notifications du même domaine (ex. commande créée vs commande
// confirmée) auront la même couleur alors qu'avant elles pouvaient
// différer (info vs success). Si cette perte de nuance pose problème,
// il faudrait ajouter un champ "niveau" côté backend.
export const NOTIFICATION_TYPE_TO_SEVERITY = {
  COMMANDE: 'info',
  PAIEMENT: 'success',
  CERTIFICATION: 'info',
  MESSAGE: 'info',
  AVIS: 'info',
  SIGNALEMENT: 'warning',
  COMPTE: 'success',
  SYSTEME: 'info',
};

/**
 * Convertit une NotificationResponse (backend) en objet tel qu'attendu
 * par NotificationsCenter.jsx / NavigationConsole.jsx.
 */
export function mapNotificationPourAffichage(dto) {
  return {
    id: dto.id,
    utilisateurId: dto.destinataireId,
    type: NOTIFICATION_TYPE_TO_SEVERITY[dto.type] || 'info',
    typeMetier: dto.type, // conservé si besoin d'un filtrage plus fin plus tard
    message: dto.titre || dto.contenu,
    lien: dto.lien,
    lu: dto.lu,
    dateCreation: dto.dateEnvoi,
  };
}

/**
 * Devine le NotificationType métier (backend) à partir du lien de
 * redirection déjà utilisé partout dans App.jsx (ex. '/orders',
 * '/admin/moderation-panel', '/profil'...). Choisi pour éviter de
 * devoir modifier chacun des appels existants à addNotification :
 * c'est une heuristique, pas une garantie — à affiner avec Reina si
 * un cas ne tombe pas dans la bonne catégorie.
 */
export function deviserTypeMetier(lien) {
  if (!lien) return 'SYSTEME';
  if (lien.includes('order') || lien.includes('commande')) return 'COMMANDE';
  if (lien.includes('moderation') || lien.includes('signalement')) return 'SIGNALEMENT';
  if (lien.includes('certification')) return 'CERTIFICATION';
  if (lien.includes('message')) return 'MESSAGE';
  if (lien.includes('avis')) return 'AVIS';
  if (lien.includes('paiement')) return 'PAIEMENT';
  if (lien.includes('profil') || lien.includes('seller-dashboard') || lien.includes('admin/dashboard')) return 'COMPTE';
  return 'SYSTEME';
}

/**
 * Construit le NotificationRequest attendu par le backend à partir des
 * paramètres historiques de addNotification(userId, uiType, message, lien).
 */
export function construireNotificationRequest(destinataireId, message, lien) {
  return {
    destinataireId,
    type: deviserTypeMetier(lien),
    titre: message,
    contenu: message,
    lien: lien || null,
  };
}
