
import type { NextPageWithLayout } from 'types'
import Meta from '@/components/meta/Meta'
import Layout from '@/components/layouts/Layout'
import Form from '@/components/Form/Form'
import { ContactMessage } from 'app/validations'
import LabeledTextField from '@/components/Form/LabeledTextField'
import LabeledTextArea from '@/components/Form/LabeledTextArea'
interface Props {
}

const ContactPage: NextPageWithLayout<Props> = ({ }) => {


    return (
        <>
            <Meta title="Me contacter" />

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
                        onSubmit={async (values) => {
                            console.log(values)
                            fetch('/api/send-email', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(values)
                            }).then(response => {
                                console.log(response)
                            }).catch(err => {
                                console.error(err)
                            })
                        }}>

                        <LabeledTextField name="subject" label="Sujet" placeholder="Sujet" />
                        <LabeledTextField name="name" label="Nom" placeholder="Votre nom" />
                        <LabeledTextField name="from" label="Votre email" placeholder="nom@email.fr" />
                        <LabeledTextArea name="html" label="Message" placeholder="Contenu du message" />

                    </Form>
                </div>
            </div>


        </>
    )
}

ContactPage.getLayout = (page) => <Layout>{page}</Layout>

export default ContactPage