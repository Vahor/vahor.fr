
import type { NextPageWithLayout } from 'types'
import Meta from '@/components/meta/Meta'
import Layout from '@/components/layouts/Layout'

interface Props {
}

const AboutPage: NextPageWithLayout<Props> = ({ }) => {

    return (
        <>
            <Meta title="A propos" />
        </>
    )
}

AboutPage.getLayout = (page) => <Layout>{page}</Layout>

export default AboutPage