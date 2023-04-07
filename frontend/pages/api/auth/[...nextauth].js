// import NextAuth from "next-auth";
// import jwtDecode from "jwt-decode";
// import CredentialsProvider from "next-auth/providers/credentials";
// import Router from 'next/router'
//
// async function refreshAccessToken(token) {
//     try {
//         const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
//             method: "POST",
//             body: JSON.stringify({refresh: token.refresh}),
//             headers: {"Content-Type": "application/json"},
//         });
//         const refreshedToken = await response.json();
//         if (response.status !== 200) {
//             throw token
//         }
//         const {exp} = jwtDecode(refreshedToken.access);
//         return {
//             ...token,
//             ...refreshedToken,
//             exp,
//         };
//     } catch (error) {
//         return {
//             ...token,
//             error: "RefreshAccessTokenError",
//         };
//     }
// }
//
// // For more information on each option (and a full list of options) go to
// // https://next-auth.js.org/configuration/options
// export const authOptions = {
//     // https://next-auth.js.org/configuration/providers/oauth
//     providers: [
//         CredentialsProvider({
//             // The name to display on the sign in form (e.g. 'Sign in with...')
//             name: "Django Rest Framework",
//             // The credentials is used to generate a suitable form on the sign in page.
//             // You can specify whatever fields you are expecting to be submitted.
//             // e.g. domain, username, password, 2FA token, etc.
//             // credentials: {
//             //     username: {
//             //         label: "Username",
//             //         type: "username",
//             //         placeholder: "username",
//             //     },
//             //     password: { label: "Password", type: "password" },
//             // },
//
//             async authorize() {
//                 try {
//                     const response = await fetch("http://localhost:8000/token/retrieve/", {
//                         method: "GET",
//                         // body: JSON.stringify(credentials),
//                         headers: {"Content-Type": "application/json"},
//                     });
//                     const token = await response.json();
//                     if (response.status !== 200) {
//                         throw token
//                     }
//                     console.log(jwtDecode(token.access));
//                     const {username, email, user_id, exp, is_superuser, is_staff} =
//                         jwtDecode(token.access);
//                     return {
//                         ...token,
//                         exp,
//                         user: {
//                             username,
//                             email,
//                             user_id,
//                             is_staff,
//                             is_superuser,
//                         },
//                     };
//                 } catch (error) {
//                     return null;
//                 }
//             },
//         }),
//     ],
//     theme: {
//         colorScheme: "light",
//     },
//     pages: {
//         signIn: "/login",
//         signOut: "/",
//         error: "/",
//         verifyRequest: "/",
//     },
//     callbacks: {
//         async redirect({url, baseUrl}) {
//             return url.startsWith(baseUrl)
//                 ? Promise.resolve("http://localhost:8000/accounts/login/")
//                 : Promise.resolve(baseUrl);
//         },
//         async jwt({token, user, account, profile, isNewUser}) {
//             // initial signin
//             if (account && user) {
//                 return user;
//             }
//
//             // Return previous token if the access token has not expired
//             if (Date.now() < token.exp * 100) {
//                 return token;
//             }
//
//             // refresh token
//             return refreshAccessToken(token);
//         },
//         async session({session, user, token}) {
//             session.user = token.user;
//             session.access = token.access;
//             session.refresh = token.refresh;
//             session.exp = token.exp;
//             return session;
//         },
//     },
//
//     session: {strategy: "jwt"},
// };
//
// export default NextAuth(authOptions);
