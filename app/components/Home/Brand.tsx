import { useEffect, useState } from "react";
import TextTransition, { presets } from "react-text-transition";


interface Props {
}

const TEXTS = [
    "Développeur Web",
    "Développeur Java",
    "Passioné d'Informatique",
]

const Brand = ({ }: Props) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() =>
            setIndex(index => (index + 1) % TEXTS.length),
            5000 // every 5 seconds
        );
        return () => clearTimeout(intervalId);
    }, []);

    return (
        <section id="brand" className="pt-16 lg:pt-24 container">
            <div className="text-center md:text-left">
                <div>
                    <span className="text-gray-400 font-mono italic">{"// "} Nathan David</span>
                </div>
                <div>
                    <span className="text-3xl lg:text-5xl font-bold w-full">
                        <span>Je suis un </span>
                        <TextTransition
                            inline
                            text={TEXTS[index]}
                            springConfig={presets.gentle}
                            direction="down"
                        />
                    </span>
                </div>
            </div>
        </section>
    )
}

export default Brand