import i18n from "i18next";

export const passwordExpireConfig =(message)=>  {
    return{
        title: i18n.t('Attention!'),
        text: message,
        icon: 'warring',
        confirmButtonColor: '#3085d6',
        confirmButtonText: i18n.t('Réinitialiser'),
    }
};


export const confirmDeleteConfig =  {
    title: i18n.t('Êtes-vous sûr?'),
    text: i18n.t("Vous ne pourrez pas revenir en arrière!"),
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: i18n.t('Oui, Supprimer!'),
    cancelButtonText: i18n.t("Quitter")
};

export const confirmRevokeConfig =  {
    title: i18n.t('Êtes-vous sûr?'),
    text: i18n.t("Vous ne pourrez pas revenir en arrière!"),
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: i18n.t('Oui, Revoquer!'),
    cancelButtonText: i18n.t("Quitter")
};

export const confirmActivation =  (label) => {
    return {
        title: i18n.t('Êtes-vous sûr?'),
        text: `${i18n.t("Le compte sera")} ${label}`,
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `${i18n.t("Oui")}, ${label}!`,
        cancelButtonText: i18n.t("Quitter")
    };
};

export const confirmLeadConfig = (lead) =>  {
    return {
        title: i18n.t('Confirmation'),
        text: lead ? `${i18n.t("Cette unité à déjà un responsable")}: ${lead}. ${i18n.t("Êtes-vous sûr de vouloire continuer?")}` : i18n.t("Êtes-vous sûr de vouloire continuer?"),
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: i18n.t('Oui, Confirmer!'),
        cancelButtonText: i18n.t("Quitter")
    }
};

export const confirmAssignConfig =  {
    title: i18n.t('Attention!'),
    text: i18n.t("Cette plainte vous sera affectée!"),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: i18n.t('Oui, confirmer!'),
    cancelButtonText: i18n.t("Quitter")
};

export const confirmTranfertConfig =  {
    title: i18n.t('Confirmation!'),
    text: i18n.t("Voulez-vous tranférer Cette Réclamation?"),
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: i18n.t('Oui, confirmer!'),
    cancelButtonText: i18n.t("Quitter")
};

export const toastDeleteErrorMessageConfig = {
    background: "#3c3e40",
    icon: 'error',
    title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white' class='m-4'>${i18n.t("Echec de la suppression")}</strong>`
};

export const chosePlan = (plan) => {
    return {
        title: `${i18n.t("Êtes-vous sûr de vouloir choisir")} ${plan} ${i18n.t("comme plan")}?`,
        text: i18n.t("Vous ne pouvez pas revenir en arrière!"),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: i18n.t('Oui, Choisir!'),
        cancelButtonText: i18n.t("Quitter")
    };
};
