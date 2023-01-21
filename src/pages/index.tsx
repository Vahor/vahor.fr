import { Meta, OrganizationMeta } from "@/components/meta";
import { type NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Meta title="Accueil" />
      <OrganizationMeta />
    </>
  );
};

export default Home;

