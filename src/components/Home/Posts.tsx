import React, {useState} from "react"
import Link from "next/link"
import Image from "next/image"
import {IconAlignRight, IconCheck} from "@tabler/icons-react";
import type {PostStatus} from "@/types/post";
import {PostStatusMap} from "@/types/post";
import clsx from "clsx";

export type PostsProps = {
    posts: {
        id: string;
        title: string;
        status: PostStatus;
        tags: string[];
        cover: {
            url: string;
            blur: string;
            width: number;
            height: number;
        }
    }[];
    tags: string[];
}

const Posts = ({posts, tags}: PostsProps) => {
    const [currentStatus, setCurrentStatus] = useState<PostStatus>('ALL')
    const [currentFilters, setCurrentFilters] = useState<string[]>([])
    const [isOpen, setOpen] = useState<boolean>(false)
    const [searchValue, setSearchValue] = useState<string>("")

    // Would be better in different components but we wont have that many projects, so the difference is not that important

    const filteredTags = tags
        .filter((tag) =>
            tag.toLowerCase().includes(searchValue.toLowerCase())
        );

    const filteredPosts = posts.filter(post => (currentStatus === 'ALL' || post.status === currentStatus)
        && currentFilters.every(filter => post.tags.includes(filter))
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
                    {Object.entries(PostStatusMap).map(([status, label]) => {
                        console.log(status, label)

                        const isActive = status === currentStatus
                        return <li
                            key={status}
                            className={clsx(
                                "border rounded-md px-3 py-1 cursor-pointer",
                                isActive ? "border-gray" : "border-transparent"
                            )}
                            onClick={() => setCurrentStatus(status as PostStatus)}
                        >
                            <span>{label}</span>
                        </li>
                    })}
                </ul>
                <div>
                    <div className="relative z-20">
                        <div className="flex space-x-2 items-center cursor-pointer"
                             onClick={() => setOpen(!isOpen)}>
                            <IconAlignRight/>
                            <span>Filtrer</span>
                        </div>
                        {isOpen && (
                            <div
                                className="absolute -left-40 top-8 bg-white-light dark:bg-black w-max max-w-xl rounded-md shadow border border-gray-300 dark:border-gray-700">
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
                                            {isActive && <IconCheck/>}
                                        </li>
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Overlay */}
                    {isOpen && <div className="fixed z-10 inset-0" onClick={() => setOpen(false)}/>}

                </div>
            </div>
            <ul className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 box-border gap-4 mx-auto before:box-inherit after:box-inherit">
                {filteredPosts.map(post => {
                    return (
                        <li key={post.id} className="break-inside">
                            <Link href={`/posts/${post.id}`}
                                  className="block group relative mb-2 rounded-md cursor-pointer overflow-hidden select-none shadow pb-[56.25%]">
                                <Image
                                    src={post.cover?.url || ""}
                                    className="group-hover:scale-105 transition duration-500 rounded-md "
                                    alt={`Illustration pour ${post.title}`}
                                    placeholder={"blur"}
                                    fill
                                    blurDataURL={post.cover?.blur}
                                />
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-60 bg-gray-900 text-white transition duration-500 ease-in-out ">
                                    <div
                                        className="flex h-full justify-center items-center text-xl font-bold">Voir
                                    </div>
                                </div>
                            </Link>
                            <span className="font-bold text-center">{post.title}</span>
                            <ul className="flex text-sm font-light space-x-1">
                                {post.tags.map(tag => (
                                    <li key={tag}>
                                        <span>{tag}</span>
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