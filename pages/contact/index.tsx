
import type { NextPageWithLayout } from 'types'
import Meta from '@/components/meta/Meta'
import Layout from '@/components/layouts/Layout'
import Form from '@/components/Form/Form'
import { ContactMessage } from 'app/validations'
import LabeledTextField from '@/components/Form/LabeledTextField'
import LabeledTextArea from '@/components/Form/LabeledTextArea'
import { Fragment, useState } from 'react'
import { Transition } from '@headlessui/react'
import { FiCheck } from "react-icons/fi"

interface Props {
}

const ContactPage: NextPageWithLayout<Props> = ({ }) => {

    const [modalVisible, setModalVisible] = useState<boolean>(false)


    return (
        <>
            <Meta title="Me contacter" />

            <Transition appear show={modalVisible} as={Fragment}>
                <div className="fixed z-10 inset-0 min-h-screen w-screen" aria-labelledby="modal-title" role="dialog" aria-modal>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        {/* Hex with opacity 99 = 60%. Default one like bg-black doesnt work */}
                        <div
                            className="fixed inset-0 bg-[#12121299] dark:bg-[#fafafa99]"
                            aria-hidden
                            onClick={() => setModalVisible(false)} />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="flex justify-center items-center min-h-screen">
                            <div className="flex flex-col items-center max-w-md mx-4 py-8 md:py-12 px-6 transition-all transform bg-white text-black shadow-xl rounded-xl">
                                <div className="text-green-400 p-4 rounded-full border w-max">
                                    <FiCheck size={50} />
                                </div>
                                <div className="pt-4 prose lg:prose-lg text-center">
                                    <h3>Votre message a été envoyé</h3>
                                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque officia dolore distinctio.</p>
                                    <button
                                        type="button"
                                        className="rounded-md px-4 py-2 border font-medium transition-colors duration-200 border-gray-800 hover:bg-black hover:text-white"
                                        onClick={() => setModalVisible(false)}
                                    >Fermer</button>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Transition >

            <div className="py-8 flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:space-x-4 container">
                <div className="flex flex-col justify-center lg:w-1/2 prose lg:prose-lg dark:prose-dark">
                    <h1>Travaillons ensembles</h1>
                    <span>
                        Écrivez-moi sur <a
                            className="text-gray-500 dark:text-gray-400"
                            href="mailto:me@vahor.fr"
                        >me@vahor.fr</a> ou utilisez le formulaire.
                    </span>
                </div>

                <div className="lg:w-1/2">
                    <Form
                        schema={ContactMessage}
                        submitText="Envoyer"
                        onSubmit={async (values, form) => {
                            console.log(values)
                            fetch('/api/send-email', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(values)
                            }).then(() => {
                                form.restart()
                                setModalVisible(true)
                            }).catch(err => {
                                console.error(err)
                            })
                        }}>

                        <LabeledTextField name="subject" label="Sujet" placeholder="Sujet" />
                        <LabeledTextField name="name" label="Nom" placeholder="Votre nom" />
                        <LabeledTextField name="from" type="email" label="Votre email" placeholder="nom@email.fr" />
                        <LabeledTextArea name="text" label="Message" placeholder="Contenu du message" />

                    </Form>
                </div>
            </div>


        </>
    )
}

ContactPage.getLayout = (page) => <Layout>{page}</Layout>

export default ContactPage