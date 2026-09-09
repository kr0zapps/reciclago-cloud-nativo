export function getRedirectUri(): string {
    if (typeof window === 'undefined' || !window.location) {
        return 'https://reciclago-frontend-puertovaras.s3.us-east-1.amazonaws.com/index.html';
    }
    // Entorno local fallback
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return window.location.origin;
    }
    // Entorno S3 HTTPS: requiere /index.html para evitar error AccessDenied en S3 REST endpoint
    if (window.location.hostname.includes('s3') && !window.location.hostname.includes('s3-website')) {
        return `${window.location.origin}/index.html`;
    }
    return window.location.origin;
}

export const environment = {
    production: true,
    msalConfig: {
        auth: {
            clientId: '20ae8f6f-ef82-48a6-a4ae-897d36212b4b',
            authority: 'https://login.microsoftonline.com/5625266d-cae0-4070-a7ea-b5e88273580f',
            get redirectUri() {
                return getRedirectUri();
            }
        }
    },
    apiConfig: {
        backendClientId: '9a946a0b-5350-4fe1-a79e-ca332612f60d',
        scopes: ['api://9a946a0b-5350-4fe1-a79e-ca332612f60d/access_as_user'],
        uri: 'http://localhost:8080'
    }
};
