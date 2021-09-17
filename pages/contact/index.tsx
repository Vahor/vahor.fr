
import type { NextPageWithLayout } from 'types'
import Meta from '@/components/meta/Meta'
import Layout from '@/components/layouts/Layout'

interface Props {
}

const ContactPage: NextPageWithLayout<Props> = ({ }) => {

    return (
        <>
            <Meta title="Me contacter" />
        </>
    )
}

ContactPage.getLayout = (page) => <Layout>{page}</Layout>

export default ContactPage