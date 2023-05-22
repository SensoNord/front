import { Directus } from '@directus/sdk';

const config = {
    auth: {
        mode: 'json', // 'json' in Node.js
        autoRefresh: true,
        msRefreshBeforeExpires: 30000,
        staticToken: '',
    },
    storage: {
        prefix: '',
        mode: 'LocalStorage', // 'MemoryStorage' in Node.js
    },
    transport: {
        params: {},
        headers: {},
        onUploadProgress: ProgressEvent => {},
        maxBodyLength: null,
        maxContentLength: null,
    },
};

export const directus = new Directus(
    process.env.REACT_APP_DIRECTUS_URL,
    config,
);
