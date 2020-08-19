export const confirmDeleteConfig =  {
    title: 'Êtes-vous sûr?',
    text: "Vous ne pourrez pas revenir en arrière!",
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, Supprimer!',
    cancelButtonText: "Quitter"
};

export const confirmLeadConfig = (lead) =>  {
    return {
        title: 'Confirmation',
        text: `Cette unité à déjà un responsable: ${lead}. Êtes-vous sûr de vouloire continuer?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, Confirmer!',
        cancelButtonText: "Quitter"
    }
};

export const confirmAssignConfig =  {
    title: 'Attention!',
    text: "Cette plainte vous sera affectée!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, confirmer!',
    cancelButtonText: "Quitter"
};

export const toastDeleteErrorMessageConfig = {
    background: "#3c3e40",
    icon: 'error',
    title: "<strong style='font-weight: bold; font-size: 1.1rem; color: white' class='m-4'>Echec de la suppression</strong>"
};

export const chosePlan = (plan) => {
    return {
        title: `Êtes-vous sûr de vouloir choisir ${plan} comme plan?`,
        text: "Vous ne pouvez pas revenir en arrière!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, Choisir!',
        cancelButtonText: "Quitter"
    };
};
