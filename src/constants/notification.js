export const notificationConfig = {
    "acknowledgment-of-receipt": "Accusé de réception",
    "register-a-claim": "Enregistrer une réclamation",
    "complete-a-claim": "Completer une réclamation",
    "transferred-to-targeted-institution": "Transféré à une institution ciblée",
    "transferred-to-unit": "Transféré à l'unité",
    "assigned-to-staff": "Assigné au personnel",
    "reject-a-claim": "Rejeter une réclamation",
    "treat-a-claim": "Traiter une réclamation",
    "invalidate-a-treatment": "Invalider un traitement",
    "validate-a-treatment": "Valider un traitement",
    "communicate-the-solution": "Communiquer la solution",
    "communicate-the-solution-unfounded": "Communiquer la solution sans fondement",
    "add-contributor-to-discussion": "Ajouter contributeur à la discussion",
    "post-discussion-message": "Message post discussion",
};

export const EventNotification = [
    "AcknowledgmentOfReceipt",
    "AddContributorToDiscussion",
    "AssignedToStaff",
    "CommunicateTheSolution",
    "CompleteAClaim",
    "InvalidateATreatment",
    "PostDiscussionMessage",
    "RegisterAClaim",
    "RejectAClaim",
    "TransferredToTargetedInstitution",
    "TransferredToUnit",
    "TreatAClaim",
    "ValidateATreatment",
];

export const EventNotificationPath = {
    AcknowledgmentOfReceipt: "",
    AddContributorToDiscussion: "",
    AssignedToStaff: id => `/process/claim-assign/${id}/detail`,
    CommunicateTheSolution: "",
    CompleteAClaim: "",
    InvalidateATreatment: "",
    PostDiscussionMessage: "",
    RegisterAClaim: "",
    RejectAClaim: "",
    TransferredToTargetedInstitution: "",
    TransferredToUnit: "",
    TreatAClaim: "",
    ValidateATreatment: "",
};

export const RelaunchNotification = [
    "ReminderBeforeDeadline",
    "ReminderAfterDeadline"
];

export const RelaunchNotificationPath = {
    ReminderBeforeDeadline: "",
    ReminderAfterDeadline: ""
};
