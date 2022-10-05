import i18n from "../i18n";

export const errorElements = [
    {
        code: "403",
        link: "/error403",
        message: i18n.t("Vous n'avez pas les permissions nécéssaires"),
    },
    {
        code: "500",
        link: "/error500",
        message: i18n.t("Erreur interne du serveur"),
    },
]