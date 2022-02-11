export const CONNECTED_USER = "CONNECTED_USER";

export const connectedUser = (data) => {
    return {type: "CONNECTED_USER", isConnected: data}
};