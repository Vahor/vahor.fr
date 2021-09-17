import React, { useState } from "react"
import { NotionPage } from "types"
import Link from "next/link"
import Image from "next/image"

interface Props {
    posts: NotionPage[];
}

const Filter = {
    ALL: "Tous",
    FINISHED: "Terminés",
    PROGRESS: "En cours"
}

type Filter = (typeof Filter)[keyof typeof Filter]

const Posts = ({ posts }: Props) => {
    const [currentFilter, setCurrentFilter] = useState<Filter>(Filter.ALL)
    return (
        <div className="container" id="projects">
            <div className="mb-8 px-2">
                <ul className="flex space-x-4 select-none">
                    {Object.entries(Filter).map(([name, filter]) => {

                        const isActive = currentFilter === filter
                        return <li
                            key={name}
                            className={`${isActive ? "border-gray" : "border-transparent"} border rounded-md px-2 py-1 cursor-pointer`}
                            onClick={() => setCurrentFilter(filter)}
                        >
                            <span>{filter}</span>
                        </li>
                    })}
                </ul>
            </div>
            <ul className="md:masonry-2-col lg:masonry-3-col box-border mx-auto before:box-inherit after:box-inherit">
                {posts.filter(post => currentFilter === Filter.ALL || post.properties.Tags.multi_select.some(tag => tag.name === currentFilter)).map(post => {
                    const type = post.cover?.type
                    const cover = type && post.cover?.[type]
                    return (
                        <li key={post.id} className="p-2 break-inside">
                            <Link href={`/post/${post.id}`}>
                                <a
                                    className="block group relative mb-2 rounded-md cursor-pointer overflow-hidden select-none shadow pb-[56.25%]"
                                >
                                    <Image
                                        src={cover?.url || ""}
                                        className="group-hover:scale-105 transition duration-500 rounded-md "
                                        alt={`Illustration pour ${post.properties.Name.title[0].plain_text}`}
                                        placeholder={"blur"}
                                        layout="fill"
                                        blurDataURL={cover?.blur}
                                        objectFit="cover"
                                    />
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-60 bg-black text-white transition duration-500 ease-in-out ">
                                        <div className="flex h-full justify-center items-center text-xl font-bold">Voir</div>
                                    </div>
                                </a>
                            </Link>
                            <span className="font-bold text-center">{post.properties.Name.title[0].plain_text}</span>
                            <ul className="flex text-sm font-light space-x-1">
                                {post.properties.Tags.multi_select.map(tag => (
                                    <li key={tag.name}>
                                        <span>{tag.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    )
                })}
            </ul>
        </div>

    )
}

export default Posts