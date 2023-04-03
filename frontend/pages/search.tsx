import Head from 'next/head';
import Image from 'next/image';

export default function Search() {
    return (
        <div className="bg-gray-100">
            <Head>
                <title>Tigerbook</title>
            </Head>

            <header className="bg-white shadow">
                <nav className="container mx-auto px-4 py-2">
                    <ul className="flex items-center justify-between">
                        <li>
                            <a href="#" className="font-bold text-lg text-gray-800">Home</a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-600 hover:text-gray-800">About</a>
                        </li>
                        <li>
                            <a href="#" className="text-gray-600 hover:text-gray-800">Contact</a>
                        </li>
                    </ul>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="w-full md:w-1/2 mb-4 md:mb-0">
                        <input type="text" placeholder="Search..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">Search</button>
                </div>
                <div className="relative h-80 md:h-96 mt-8">
                    <Image src="/placeholder-cover-image.jpg" alt="Cover Image" layout="fill" objectFit="cover" />
                </div>
            </main>

            <footer className="bg-white border-t border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <p className="text-gray-500 text-center">&copy; My Next.js App 2023</p>
                </div>
            </footer>
        </div>
    );
}
