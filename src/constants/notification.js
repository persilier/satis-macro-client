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
    "reminder-before-deadline": "Relance automatique avant échéance",
    "reminder-after-deadline": "Relance automatique après échéance"
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
    AddContributorToDiscussion: id => `/chat#message-chat`,
    AssignedToStaff: id => `/process/claim-assign/${id}/detail`,
    CompleteAClaim: id => `/process/claim-assign/${id}/detail`,
    InvalidateATreatment: id => `/process/claim-assign/to-staff/${id}/detail`,
    PostDiscussionMessage: id => `/message-receved`,
    RegisterAClaim: {
        "full": id => `/process/claim-assign/${id}/detail`,
        "incomplete": id => `/process/incomplete_claims/edit/${id}`
    },
    RejectAClaim: id => `/process/claim-assign/${id}/detail`,
    TransferredToTargetedInstitution: id => `/process/claim-assign/${id}/detail`,
    TransferredToUnit: id => `/process/claim-list-detail/${id}/detail`,
    TreatAClaim: id => `/process/claim-to-validated/${id}/detail`,
    ValidateATreatment: id =>`/process/claim_measure/${id}/detail` ,
};

export const RelaunchNotification = [
    "ReminderBeforeDeadline",
    "ReminderAfterDeadline"
];
