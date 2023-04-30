/** @type {import('tailwindcss').Config} */
module.exports = {
    safelist: [
        'z-[1]',
        'z-[2]',
        'z-[3]',
        'z-[4]',
        'z-[5]',
        'z-[6]',
        'z-[7]',
        'z-[8]',
        'z-[9]',
        'z-[11]',
        'z-[12]',
        'z-[13]',
        'z-[14]',
        'z-[15]',
        'z-[16]',
        'z-[17]',
        'z-[18]',
        'z-[19]',
        'z-[21]',
        'z-[22]',
        'z-[23]',
        'z-[24]',
        'z-[25]',
        'z-[26]',
        'z-[27]',
        'z-[28]',
        'z-[29]',
        'z-[31]',
    ],
    content: [
        "./node_modules/flowbite/**/*.js",
        "./node_modules/flowbite-react/**/*.js",
        "./components/**/*.{ts,tsx}",
        "./context/**/*.{ts,tsx}",
        "./hooks/**/*.{ts,tsx}",
        "./pages/**/*.{ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    "50": "#FFD0A0",
                    "100": "#FFC68B",
                    "200": "#FFB262",
                    "300": "#FF9E3A",
                    "400": "#FF8911",
                    "500": "#E77500",
                    "600": "#AF5900",
                    "700": "#773C00",
                    "800": "#3F2000",
                    "900": "#070300"
                },
                dark: "#0e090f"
            },
            zIndex: {
                '5': '5',
                '15': '15',
                '100': '100',
            }
        },
        fontFamily: {
            'body': [
                'Inter',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'system-ui',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'Noto Sans',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',
                'Segoe UI Symbol',
                'Noto Color Emoji'
            ],
            'sans': [
                'Inter',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'system-ui',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'Noto Sans',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',
                'Segoe UI Symbol',
                'Noto Color Emoji'
            ]
        }
    },
    plugins: [],
}

