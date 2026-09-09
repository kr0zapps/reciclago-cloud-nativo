export const environment = {
    production: false,
    msalConfig: {
        auth: {
            clientId: '20ae8f6f-ef82-48a6-a4ae-897d36212b4b',

            authority: 'https://login.microsoftonline.com/5625266d-cae0-4070-a7ea-b5e88273580f',

            redirectUri: typeof window !== 'undefined' && window.location?.origin
                ? window.location.origin
                : 'http://localhost:4200'
        }
    }
};