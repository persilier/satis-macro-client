import Swal from "sweetalert2";

export const toastConfig =  {
    toast: true,
    position: 'top-end',
    showConfirmButton: true,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
};

export const toastDeleteSuccessMessageConfig = {
    icon: 'success',
    title: 'Supprimé avec succès'
};

export const toastDeleteErrorMessageConfig = {
    icon: 'error',
    title: 'Suppression échouée'
};

export const toastAddSuccessMessageConfig = {
    icon: 'success',
    title: 'Ajouter avec succès'
};

export const toastAddErrorMessageConfig = {
    icon: 'error',
    title: 'Ajout échoué'
};