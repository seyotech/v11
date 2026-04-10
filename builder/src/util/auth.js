// import graphFetch from './graphFetch';
// import store from '../redux/store';

// export async function auth(next) {
//     const state = store.getState();
//     if (state.users?.authUser?.expiresAt * 1000 < Date.now()) {
//         const result = await refreshAT();
//         if (result?.data?.refreshToken) {
//             store.dispatch({
//                 type: 'REFRESH_AT_SUCCESS',
//                 payload: result.data.refreshToken,
//             });
//             return next();
//         }
//     } else {
//         return next();
//     }
// }

// async function refreshAT() {
//     const result = await graphFetch(
//         {
//             queryName: 'refreshToken',
//             select: 'token success expiresAt user { id role }',
//         },
//         { mutation: true, ignoreToken: true }
//     );
//     return result;
// }
