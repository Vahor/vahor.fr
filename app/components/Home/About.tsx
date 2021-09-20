

interface Props {
}

const About = ({ }: Props) => {
    return (
        <section id="about" className="py-16 lg:py-24 container">
            <div className="pb-8 md:w-3/4 xl:w-2/3 text-center md:text-left">
                <div>
                    <span className="text-gray-400 font-mono italic">{"// "} En savoir plus sur moi</span>
                </div>
                <div>
                    <span className="text-3xl lg:text-5xl font-bold">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorem </span>
                </div>
            </div>
            <div className="prose dark:prose-dark pb-8">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime consectetur id accusamus reiciendis minus saepe? Excepturi nam deserunt tempora, sunt corporis modi adipisci facilis tempore esse! Explicabo fuga eius incidunt!
            </div>
            <div className="text-center md:text-left">
                <a href="#"
                    className="md:mx-0 bg-gray-900 px-6 py-3 text-white rounded-md hover:bg-white hover:text-gray-900 transition duration-400 border">
                    Télécharger mon cv</a>
            </div>
        </section>
    )
}

export default About