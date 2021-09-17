import React from "react"
import Link from 'next/link'
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

const FooterLink = ({ text, href }: { text: string; href: string }) => {
    return (
        <Link href={href}>
            <a className={"text-gray-500 hover:text-gray-600 transition"}>{text}</a>
        </Link>
    )
}
const ExtrernalLink = ({ text, href }: { text: string; href: string }) => {
    return (
        <Link href={href}>
            <a
                className="text-gray-500 hover:text-gray-600 transition"
                target="_blank"
                rel="noopener noreferrer"
                href={href}
            >{text}</a>
        </Link>
    )
}

const Footer = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    return (
        <footer className="bg-white dark:bg-black border-t dark:border-gray-800 p-8">
            <div className="flex md:max-w-lg justify-center mx-auto">
                <div className="max-w-xs w-full flex flex-col px-8 pb-4 space-y-4">
                    <FooterLink text="Accueil" href="/" />
                    <FooterLink text="A propos" href="/about" />
                    <FooterLink text="Articles" href="/posts" />
                </div>

                <div className="max-w-xs w-full flex flex-col px-8 pb-4 space-y-4">
                    <ExtrernalLink text="Twitter" href="/" />
                    <ExtrernalLink text="GitHub" href="https://github.com/Vahor" />
                    <ExtrernalLink text="LinkedIn" href="/" />
                </div>
            </div>
            <div className="flex justify-end">

                {mounted && (
                    <div className="rounded-md flex p-1 bg-gray-200 dark:bg-gray-800 w-max space-x-2 text-sm">
                        <div
                            className={`flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-white px-1 py-1 rounded-md ${theme === "light" ? "bg-white dark:bg-gray-600" : ""}`}
                            onClick={() => setTheme("light")}>
                            <FiSun />
                            <span>Light</span>
                        </div>
                        <div
                            className={`flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-white px-1 py-1 rounded-md ${theme === "dark" ? "bg-white dark:bg-gray-600" : ""}`}
                            onClick={() => setTheme("dark")}>
                            <FiMoon />
                            <span>Dark</span>
                        </div>
                        <div
                            className={`flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-white px-1 py-1 rounded-md ${theme === "system" ? "bg-white dark:bg-gray-600" : ""}`}
                            onClick={() => setTheme("system")}>
                            <FiMonitor />
                            <span>System</span>
                        </div>
                    </div>
                )}

            </div>
        </footer>

    )
}

export default Footer