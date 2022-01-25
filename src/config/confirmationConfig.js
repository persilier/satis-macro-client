import i18n from "i18next";

export const confirmDeleteConfig =  {
    title: i18n.t('Êtes-vous sûr?'),
    text: i18n.t("Vous ne pourrez pas revenir en arrière!"),
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: i18n.t('Oui, supprimez-le!'),
    cancelButtonText: i18n.t("Quitter")
};