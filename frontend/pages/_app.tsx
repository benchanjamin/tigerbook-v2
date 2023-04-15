import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {NotificationContextProvider} from "../context/NotificationContext"
import Layout from "@components/Layout";

export default function App({Component, pageProps,}: AppProps) {
    return (
        <NotificationContextProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </NotificationContextProvider>
    )
}
