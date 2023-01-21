import React from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import clsx from "clsx";

const navigation = (currentPath: string): { name: string; href: string, current?: boolean }[] => {
    return [
        {name: "Accueil", href: "/", current: true},
        {name: "Blog", href: "/posts"},
    ].map((item) => {
        item.current = "/" + currentPath.split("/")[1] === item.href;
        return item;
    });
};

export const Navbar = () => {
    const {pathname} = useRouter();

    return (
        <header className="bg-white-light dark:bg-black-dark border-b dark:border-gray-800">

            <div className="container flex justify-end items-center h-16 lg:text-lg">
                <nav className="flex space-x-3 lg:space-x-6 items-center font-light">
                    <div className="hidden md:flex space-x-3 lg:space-x-6 items-center">
                        {navigation(pathname).map((item) => (
                            <Link href={item.href} key={item.name} className={clsx(
                                "hover:text-gray-600 dark:hover:text-gray-400 transition",
                                item.current ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"
                            )}>
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <Link
                        target="_blank"
                        href='mailto:me@vahor.fr'
                        className={clsx(
                            "rounded-md px-4 py-2 border font-medium transition-colors duration-200 border-gray-800",
                            pathname === "/contact" ? "bg-white-light text-black dark:bg-white dark:text-black" : "bg-black text-white-light hover:bg-white-light hover:text-black dark:hover:bg-white"
                        )}>
                        Me contacter
                    </Link>
                </nav>
            </div>
        </header>

    );
};

