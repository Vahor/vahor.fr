import React from "react"
import Link from 'next/link'
import { useRouter } from "next/router"

const navigation = (currentPath: string): { name: string; href: string, current?: boolean }[] => {
    return [
        { name: "Accueil", href: "/", current: true },
        { name: "Blog", href: "/posts" },
        { name: "A propos", href: "/about" },
    ].map((item) => {
        item.current = "/" + currentPath.split("/")[1] === item.href
        return item
    })
}

const Navbar = () => {
    const { pathname } = useRouter()
    return (
        <header className="bg-white-light dark:bg-black-dark border-b dark:border-gray-800">

            <div className="container flex justify-between items-center h-16 lg:text-lg">

                <div className="flex flex-1 justify-center items-center md:items-stretch md:justify-start">
                    <Link href={"/"}>
                        <a className="flex flex-shrink-0 items-center">
                            <img
                                className={"block h-8 w-auto"}
                                height={32}
                                width={32}
                                src="https://static.vahor.fr/vahor/logo.png"
                                alt="logo"
                            />
                        </a>
                    </Link>
                </div>

                <nav className="flex space-x-3 lg:space-x-6 items-center font-light">
                    <div className="hidden md:flex space-x-3 lg:space-x-6 items-center">

                        {navigation(pathname).map((item) => (
                            <Link href={item.href} key={item.name}>
                                <a
                                    className={`${item.current ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"} hover:text-gray-600 transition`}
                                >
                                    {item.name}
                                </a>
                            </Link>
                        ))}
                    </div>

                    <Link href={"/contact"} >
                        <a className={`${pathname === "/contact" ?
                            " bg-white-light text-black dark:bg-white dark:text-black" :
                            "bg-black text-white-light hover:bg-white-light hover:text-black dark:hover:bg-white "}
                         rounded-md px-4 py-2 border font-medium transition-colors duration-200 border-gray-800 `}>
                            Me contacter
                        </a>
                    </Link>
                </nav>
            </div>
        </header>

    )
}

export default Navbar