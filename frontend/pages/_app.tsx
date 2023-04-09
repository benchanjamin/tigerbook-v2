import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {SessionProvider} from "next-auth/react"
import FlowbiteContext from "../context/FlowbiteContext"

// import AuthenticationProvider from '../context/AuthenticationContext'

export default function App({
                                Component,
                                pageProps: {session, ...pageProps},
                            }: AppProps) {
    return (
        <SessionProvider session={session}>
            <FlowbiteContext>
                <Component {...pageProps} />
            </FlowbiteContext>
        </SessionProvider>
    )
}
