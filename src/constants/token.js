import ls from 'localstorage-slim'

export const AUTH_TOKEN = `Bearer ${localStorage.getItem('token')}`;
