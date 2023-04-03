import {Html, Head, Main, NextScript} from 'next/document';
import Script from "next/script";


export default function Document() {
    return (
        <Html lang="en" class="scroll-smooth">
            <Head>
                <link rel="icon" href="/favicon.ico"/>
                <Script src="https://unpkg.com/flowbite@1.4.7/dist/flowbite.js" strategy="beforeInteractive"></Script>
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}
