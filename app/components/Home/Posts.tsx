import React, { useState } from "react"
import { NotionPage } from "types"
import Link from "next/link"
import Image from "next/image"
import { BsFilterRight } from "react-icons/bs"
import { FiCheck } from "react-icons/fi"

interface Props {
    posts: NotionPage[];
    tags: string[];
}

const Status = {
    ALL: "Tous",
    FINISHED: "Terminés",
    PROGRESS: "En cours"
}

type Status = (typeof Status)[keyof typeof Status]

const Posts = ({ posts, tags }: Props) => {
    const [currentStatus, setCurrentStatus] = useState<Status>(Status.ALL)
    const [currentFilters, setCurrentFilters] = useState<string[]>([])
    const [isOpen, setOpen] = useState<boolean>(false)
    const [searchValue, setSearchValue] = useState<string>("")

    // Would be better in different components but we wont have that many projects, so the difference is not that important

    const filteredTags = tags
        .filter((tag) =>
            tag.toLowerCase().includes(searchValue.toLowerCase())
        );

    const filteredPosts = posts.filter(post => (currentStatus === Status.ALL || post.properties.Status.select?.name === currentStatus)
        && currentFilters.every(filter => post.properties.Tags.multi_select.some(tag => tag.name === filter))
    )

    const toggleFilter = (value: string) => {

        const index = currentFilters.indexOf(value)
        if (index !== -1) {
            currentFilters.splice(index, 1);
        } else {
            currentFilters.push(value);
        }
        setCurrentFilters([...currentFilters]);
    }

    return (
        <div className="container pt-16" id="projects">
            <div className="mb-8 px-2 flex justify-between items-center">
                <ul className="flex space-x-2 md:space-x-4 select-none">
                    {Object.entries(Status).map(([name, status]) => {

                        const isActive = currentStatus === status
                        return <li
                            key={name}
                            className={`${isActive ? "border-gray" : "border-transparent"} border rounded-md px-3 py-1 cursor-pointer`}
                            onClick={() => setCurrentStatus(status)}
                        >
                            <span>{status}</span>
                        </li>
                    })}
                </ul>
                <div>
                    <div className="relative z-20">
                        <div className="flex space-x-2 items-center cursor-pointer"
                            onClick={() => setOpen(!isOpen)}>
                            <BsFilterRight />
                            <span>Filtrer</span>
                        </div>
                        {isOpen && (
                            <div className="absolute -left-40 top-8 bg-white-light dark:bg-black w-max max-w-xl rounded-md shadow border border-gray-300 dark:border-gray-700">
                                <div className="px-2">
                                    <input
                                        aria-label="Chercher un tag"
                                        type="text"
                                        defaultValue={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        placeholder="Chercher un tag"
                                        className="px-2 py-1 border border-gray-300 dark:border-gray-900 w-full rounded-md my-2"
                                    />
                                </div>

                                <ul className="border-t border-gray-300 dark:border-gray-900">
                                    {filteredTags.map(tag => {
                                        const isActive = currentFilters.includes(tag)
                                        return <li
                                            key={tag}
                                            className="flex items-center justify-between py-2 px-4 border-b last:border-transparent hover:text-gray-600 dark:hover:text-gray-400 border-gray-300 dark:border-gray-700 cursor-pointer"
                                            onClick={() => toggleFilter(tag)}
                                        >
                                            <span>{tag}</span>
                                            {isActive && <FiCheck />}
                                        </li>
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Overlay */}
                    {isOpen && <div className="fixed z-10 inset-0" onClick={() => setOpen(false)} />}

                </div>
            </div>
            <ul className="md:masonry-2-col lg:masonry-3-col box-border mx-auto before:box-inherit after:box-inherit">
                {filteredPosts.map(post => {
                    const type = post.cover?.type
                    const cover = type && post.cover?.[type]
                    return (
                        <li key={post.id} className="p-2 break-inside">
                            <Link href={`/posts/${post.id}`}>
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
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-60 bg-gray-900 text-white transition duration-500 ease-in-out ">
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