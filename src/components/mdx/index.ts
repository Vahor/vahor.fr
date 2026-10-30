import Anchor from "./Anchor.astro";
import B from "./B.astro";
import Callout from "./Callout.astro";
import Figure from "./Figure.astro";
import G from "./G.astro";
import H1 from "./H1.astro";
import H2 from "./H2.astro";
import H3 from "./H3.astro";
import H4 from "./H4.astro";
import H5 from "./H5.astro";
import Hr from "./Hr.astro";
import Image from "./Image.astro";
import Paragraph from "./Paragraph.astro";
import R from "./R.astro";
import Toc from "./Toc.astro";
import UrlPreview from "./UrlPreview.astro";
import Video from "./Video.astro";
import Vimeo from "./Vimeo.astro";
import Wip from "./Wip.astro";
import Y from "./Y.astro";

export const mdxComponents = {
	a: Anchor,
	figure: Figure,
	h1: H1,
	h2: H2,
	h3: H3,
	h4: H4,
	h5: H5,
	p: Paragraph,
	hr: Hr,
	img: Image,
	callout: Callout,
	R,
	G,
	B,
	Y,
	Toc,
	UrlPreview,
	Video,
	Vimeo,
	Wip,
};

export default mdxComponents;
