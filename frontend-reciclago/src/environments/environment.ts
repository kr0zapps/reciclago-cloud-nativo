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
    },
    apiConfig: {
        backendClientId: '9a946a0b-5350-4fe1-a79e-ca332612f60d',
        scopes: ['api://9a946a0b-5350-4fe1-a79e-ca332612f60d/access_as_user'],
        uri: 'http://localhost:8080/api'
    }
};