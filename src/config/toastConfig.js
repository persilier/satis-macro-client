import i18n from "i18next";
import Swal from "sweetalert2";

export const toastBottomEndConfig =  {
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 6000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
};

export const toastTopEndConfig =  {
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
};

export const toastTopStartConfig =  {
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
};

export const toastBottomStartConfig =  {
    toast: true,
    position: 'bottom-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
};

export const toastCenterStartConfig =  {
    toast: true,
    position: 'center-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
};

export const toastCenterEndConfig =  {
    toast: true,
    position: 'center-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
};

export const toastAddErrorMessageConfig = {
    background: "#3c3e40",
    icon: 'error',
    title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white' class='m-4'>${i18n.t("Echec de l'enregistrement")}</strong>`
};

export const toastAddSuccessMessageConfig = {
    background: "#3c3e40",
    icon: 'success',
    title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white;' class='m-4'>${i18n.t("Succès de l'enregistrement")}</strong>`
};
export const toastConnectSuccessMessageConfig = {
    background: "#3c3e40",
    icon: 'success',
    title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white;' class='m-4'>${i18n.t("Connexion réussie")}</strong>`
};
export const toastConnectErrorMessageConfig = {
    background: "#3c3e40",
    icon: 'error',
    title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white;' class='m-4'>${i18n.t("Connexion échouée")}</strong>`
};

export const toastEditSuccessMessageConfig = {
    background: "#3c3e40",
    icon: 'success',
    title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white;' class='m-4'>${i18n.t("Succès de la modification")}</strong>`
};

export const toastEditErrorMessageConfig = {
    background: "#3c3e40",
    icon: 'error',
    title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white' class='m-4'>${i18n.t("Echec de la modification")}</strong>`
};

export const toastDeleteSuccessMessageConfig = {
    background: "#3c3e40",
    icon: 'success',
    title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white' class='m-4'>${i18n.t("Succès de la suppression")}</strong>`
};

export const toastDeleteErrorMessageConfig = {
    background: "#3c3e40",
    icon: 'error',
    title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white' class='m-4'>${i18n.t("Echec de la suppression")}</strong>`
};

export const toastErrorMessageWithParameterConfig = (message) => {
    return {
        background: "#3c3e40",
        icon: 'error',
        title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white' class='m-4'>${message}</strong>`
    }
};

export const toastSuccessMessageWithParameterConfig = (message) => {
    return {
        background: "#3c3e40",
        icon: 'success',
        title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white' class='m-4'>${message}</strong>`
    }
};

export const toastMergeSuccessMessageConfig = {
    background: "#3c3e40",
    icon: 'success',
    title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white;' class='m-4'>${i18n.t("Plainte fusionée avec succes")}</strong>`
};

export const toastRejectClaimSuccessMessageConfig = {
    background: "#3c3e40",
    icon: 'success',
    title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white;' class='m-4'>${i18n.t("Réclamation rejetée avec succès")}</strong>`
};

export const toastAssignClaimSuccessMessageConfig = {
    background: "#3c3e40",
    icon: 'success',
    title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white;' class='m-4'>${i18n.t("Réclamation affectée avec succès")}</strong>`
};

export const toastRejectTreatmentClaimSuccessMessageConfig = {
    background: "#3c3e40",
    icon: 'success',
    title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white;' class='m-4'>${i18n.t("Rejeter avec succès")}</strong>`
};

export const toastValidateTreatmentClaimSuccessMessageConfig = {
    background: "#3c3e40",
    icon: 'success',
    title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white;' class='m-4'>${i18n.t("Succès de la validation")}</strong>`
};

export const toastInvalidPeriodMessageConfig = {
    background: "#3c3e40",
    icon: 'error',
    title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white;' class='m-4'>${i18n.t("Période invalide")}</strong>`
};

export const toastValidPeriodMessageConfig = {
    background: "#3c3e40",
    icon: 'success',
    title: `<strong style='font-weight: bold; font-size: 1.1rem; color: white;' class='m-4'>${i18n.t("Période valide")}</strong>`
};
