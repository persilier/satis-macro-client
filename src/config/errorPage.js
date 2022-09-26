export const ERROR_401 = "/error401";



export const redirectErrorPage = code => {
    if (code === 401 || code === 403 || code === 500)
        window.location.href = `/error${code}`;
};
