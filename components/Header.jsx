"use client";

import { useEffect, useState } from 'react';
import { Button } from "./ui/button";
import Nav from "./Nav";
import MobileNav from "./MobileNav";
import Link from 'next/link';

const getCurrentTimeInTimeZone = (timeZone) => {
    const now = new Date();
    return new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(now);
};

const Header = () => {
    const [buttonAnimation, setButtonAnimation] = useState('');

    useEffect(() => {
        function updateButtonAnimation() {
            const timeZone = 'Europe/Athens'; // Greece timezone
            const [hours] = getCurrentTimeInTimeZone(timeZone).split(':').map(Number);

            if (hours >= 10 && hours < 20) {
                setButtonAnimation('blink-green-white');
            } else {
                setButtonAnimation('blink-red');
            }
        }

        updateButtonAnimation();
        const intervalId = setInterval(updateButtonAnimation, 60 * 60 * 1000); // Update every hour
        return () => clearInterval(intervalId);
    }, []);

    return (
        <header className="py-8 xl:py-12 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/">
                    <h1 className="text-4xl font-semibold">
                        Jim<span className="text-accent">.</span>
                    </h1>
                </Link>
                <div className="hidden xl:flex items-center gap-8">
                    <Nav />
                    <Link href="/contact">
                        <Button className={buttonAnimation}>I'm Available!</Button>
                    </Link>
                </div>
                <div className="xl:hidden">
                    <MobileNav />
                </div>
            </div>
        </header>
    );
};

export default Header;
