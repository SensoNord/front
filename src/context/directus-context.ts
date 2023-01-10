import { Auth, Directus, TypeMap } from '@directus/sdk';
import { createContext } from 'react';

export const DirectusContext = createContext({} as Directus<TypeMap, Auth>);
