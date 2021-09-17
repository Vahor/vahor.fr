import React from "react"
import Link from 'next/link'

const navigation = (): { name: string; href: string }[] => {
    return [
        { name: "Projets", href: "/#projects" },
        { name: "A propos", href: "/#about" },
    ]
}

const Navbar = () => {
    return (
        <header className="bg-white border-b ">

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

                        {navigation().map((item) => (
                            <Link href={item.href} key={item.name}>
                                <a
                                    className={`hover:text-primary`}
                                >
                                    {item.name}
                                </a>
                            </Link>
                        ))}
                    </div>

                    <Link href={"#contact"} >
                        <a className="rounded-md px-4 py-2 border hover:bg-black hover:text-white font-medium">
                            Me contacter
                        </a>
                    </Link>
                </nav>
            </div>
        </header>

    )
}

export default Navbar