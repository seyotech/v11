// import { GRAPHQL_API_URL } from '../config';
// import store from '../redux/store';
// import { getAccessToken, getAuthInfo } from '../redux/selectors';
// import graphFetch from '../util/graphFetch';

// function requext(url = GRAPHQL_API_URL, body, options = {}) {
//     const token = getAccessToken(store.getState());

//     const defaults = {
//         mode: 'cors',
//         method: 'POST',
//         cache: 'default',
//         credentials: 'include',
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + (token || ''),
//         },
//     };
//     return fetch(url, {
//         body,
//         ...defaults,
//         ...options,
//     });
// }

// export default requext;

// let expires;
// export async function withCheckAuth(url, options) {
//     let { expiresAt, token } = getAuthInfo(store.getState());
//     expiresAt = expires || expiresAt;
//     if (expiresAt * 1000 < Date.now()) {
//         const { data } = await refreshToken();
//         if (data.refreshToken.token) {
//             token = data.refreshToken.token;
//             expires = data.refreshToken.expiresAt;
//         }
//     }
//     options.headers = {
//         Authorization: 'Bearer ' + (token || ''),
//     };
//     const response = await requext(url, null, options);
//     return await response.json();
// }

// async function refreshToken() {
//     try {
//         const mutation = true;
//         return await graphFetch(
//             {
//                 queryName: 'refreshToken',
//                 select: `token expiresAt`,
//             },
//             mutation
//         );
//     } catch (err) {
//         return err;
//     }
// }
