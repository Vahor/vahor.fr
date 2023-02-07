import type {Annotations, NotionBlockContent, NotionBlockType, NotionContent, TextElement,} from "./types";
import type {ReactElement} from "react";
import {Fragment} from "react";
import Image from "next/image";
import Highlight, {defaultProps} from "prism-react-renderer";
import theme from "prism-react-renderer/themes/palenight";
import slugify from "slugify";


const CheckIcon = () => {
    return (
        <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 20 20"
            height="12"
            width="12"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
            ></path>
        </svg>
    );
};

const getId = (block: NotionBlockContent): string => {
    const innerText = block.rich_text.map((t: TextElement) => t.plain_text).join("");
    return slugify(innerText, {lower: true});
}

const BlockWrapper = (
    type: NotionBlockType,
    block: NotionBlockContent & any,
    children: ReactElement
): ReactElement => {
    switch (type) {
        case "heading_1": {
            const id = getId(block)
            return <h2 id={id}><a href={`#${id}`} className="no-underline font-bold text-inherit">{children}</a></h2>;
        }
        case "heading_2": {
            const id = getId(block)
            return <h3 id={id}><a href={`#${id}`} className="no-underline font-bold text-inherit">{children}</a></h3>;
        }
        case "heading_3": {
            const id = getId(block)
            return <h4 id={id}><a href={`#${id}`} className="no-underline font-bold text-inherit">{children}</a></h4>;
        }
        case "paragraph": {
            return <p className="!mb-0">{children}</p>;
        }
        case "bulleted_list_item": {
            return <li className="pl-2 !my-1">{children}</li>;
        }
        case "image": {
            return (
                <figure className={`wide text-center`}>
                    <img
                        src={block.file.url}
                        alt={block.caption?.[0]?.plain_text || ""}
                        className="rounded-md mx-auto"
                    />
                    {block.caption && <figcaption>{children}</figcaption>}
                </figure>
            );
        }
        case "to_do": {
            return (
                <div>
                    <label className="flex items-center py-1 font-light border-b">
                        <div
                            className={`flex flex-shrink-0 items-center justify-center border rounded-md h-5 w-5 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-400`}
                        >
                            {block.checked && CheckIcon()}
                        </div>
                        <span
                            className={`ml-2 mr-1 ${block.checked ? "line-through" : ""}`}
                        >
              {children}
            </span>
                    </label>
                </div>
            );
        }
        case "bookmark": {
            return (
                <a
                    href={block.url}
                    className="my-2 border rounded-sm !no-underline group relative dark:border-gray-800 bg-white-light dark:bg-black-dark dark:text-white"
                >
                    <div
                        className="absolute inset-0 transition duration-500 ease-in-out bg-black opacity-0 group-hover:opacity-10 dark:bg-white-light "/>
                    <div className="grid h-32 grid-cols-3">
                        <div className="flex flex-col justify-between col-span-3 p-4 text-sm md:col-span-2">
                            <div className="text-md">{block.meta.title}</div>
                            <div className="font-light break-words overflow-hidden max-h-[3.5em]">
                                {block.meta.description}
                            </div>
                            <div className="">{block.url}</div>
                        </div>
                        <div className="relative hidden w-full h-32 md:block">
                            <Image
                                src={block.meta.image.url}
                                alt={`Illustration pour ${block.meta.title}`}
                                placeholder={block.meta.image.blur && "blur"}
                                fill
                                blurDataURL={block.meta.image.blur}
                                unoptimized={true}
                                className='!my-0'
                                style={{
                                    objectFit: "cover",
                                    objectPosition: "center",
                                }}
                            />
                        </div>
                    </div>
                </a>
            );
        }
        case "divider": {
            return (<hr/>)
        }
        case "code": {
            return <Highlight {...defaultProps} code={block.rich_text[0].plain_text} language={block.language}
                              theme={theme}>
                {({className, style, tokens, getLineProps, getTokenProps}) => (
                    <pre className={className} style={style}>
            {tokens.map((line, i) => (
                <div key={i} {...getLineProps({line, key: i})}>
                    <span className="w-2 pr-4 opacity-30">{i + 1}</span>
                    {line.map((token, key) => <span key={key} {...getTokenProps({token, key})} />)}
                </div>
            ))}
          </pre>
                )}
            </Highlight>
        }
        case "video": {
            const videoUrl = block.external.url; // vimeo url
            const videoId = videoUrl.split("/").pop(); // vimeo id
            return <iframe src={`https://player.vimeo.com/video/${videoId}`} frameBorder="0"
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                           allowFullScreen className="w-full aspect-video"/>
        }
    }

    return <div>{children}</div>;
};

const BlockClass = (annotations: Annotations) => {
    let className = "";
    if (annotations.bold) className += "font-bold";
    if (annotations.italic) className += "italic";
    if (annotations.underline) className += "underline";
    if (annotations.strikethrough) className += "line-through";
    return className;
};

const BlockText = (text: TextElement) => {
    if (text.href) {
        return (
            <a href={text.href} className={BlockClass(text.annotations)}>
                {text.plain_text}
            </a>
        );
    }
    if (text.annotations.code) {
        return (
            <code className={`${BlockClass(text.annotations)} dark:text-white-light`}>
                {text.plain_text}
            </code>
        );
    }
    return (
        <span className={BlockClass(text.annotations)}>{text.plain_text}</span>
    );
};

interface NotionPageContentProps {
    page: NotionContent;
}

export const NotionPageContent = ({page}: NotionPageContentProps) => {
    return (
        <article
            className={`py-8 container prose lg:prose-lg dark:prose-dark max-w-none base`}
        >
            {page.results.map((block) => {
                const type = block.type;

                return (
                    <Fragment key={block.id}>
                        {BlockWrapper(
                            type,
                            block?.[type],
                            <>
                                {block?.[type].rich_text?.map((text: TextElement, i) => {
                                    return <Fragment key={i}>{BlockText(text)}</Fragment>;
                                })}
                            </>
                        )}
                    </Fragment>
                );
            })}
        </article>
    );
};
