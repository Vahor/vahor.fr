import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { IconDeviceDesktop, IconMoon, IconSun } from "@tabler/icons-react";

const FooterLink = ({ text, href }: { text: string; href: string }) => {
  return (
    <Link href={href} className="text-gray-500 hover:text-gray-600 transition">
      {text}
    </Link>
  );
};
const ExternalLink = ({ text, href }: { text: string; href: string }) => {
  return (
    <Link className="text-gray-500 hover:text-gray-600 transition"
          target="_blank"
          rel="noopener noreferrer"
          href={href}>
      {text}
    </Link>
  );
};

const ThemeSelectorButton = ({ theme, children }: { theme: "light" | "dark" | "system", children: any }) => {
  const { theme: currentTheme, setTheme } = useTheme();
  return <div
    className={`flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-white px-2 py-1 rounded-md ${currentTheme === theme ? "bg-white-dark dark:bg-black-light" : ""}`}
    onClick={() => setTheme(theme)}>
    {children}
  </div>;
};

export const Footer = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <footer className="bg-white-light dark:bg-black-dark border-t dark:border-gray-800 p-8 mt-8">
      <div className="flex md:max-w-lg justify-center mx-auto">
        <div className="max-w-xs w-full flex flex-col px-8 pb-4 space-y-4">
          <FooterLink text="Accueil" href="/" />
          <FooterLink text="A propos" href="/about" />
          <FooterLink text="Articles" href="/posts" />
        </div>

        <div className="max-w-xs w-full flex flex-col px-8 pb-4 space-y-4">
          <ExternalLink text="Twitter" href="https://twitter.com/vahor_" />
          <ExternalLink text="GitHub" href="https://github.com/Vahor" />
          <ExternalLink text="LinkedIn" href="https://www.linkedin.com/in/nathan--david" />
        </div>
      </div>
      <div className="flex justify-end">

        {mounted && (
          <div
            className="rounded-md flex p-1 border border-gray-300 dark:border-gray-800 bg-white-light dark:bg-black w-max space-x-2 text-sm">
            <ThemeSelectorButton theme="light">
              <IconSun />
              <span>Light</span>
            </ThemeSelectorButton>
            <ThemeSelectorButton theme="dark">
              <IconMoon />
              <span>Dark</span>
            </ThemeSelectorButton>
            <ThemeSelectorButton theme="system">
              <IconDeviceDesktop />
              <span>System</span>
            </ThemeSelectorButton>
          </div>
        )}

      </div>
    </footer>

  );
};

