import React from 'react'
import { useRouter } from 'next/router'
import Container from '../common/Container'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function BreadCrumb() {
    const router = useRouter()
    const { categories, blog } = router.query

    // Format the text by replacing hyphens with spaces and capitalizing
    const formatText = (text) => {
        if (!text) return ''
        return text
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    // Format URL-safe text
    const formatUrl = (text) => {
        if (!text) return ''
        return text.replace(/\s+/g, '-').toLowerCase()
    }

    // Build paths array based on available route parameters
    const paths = [
        {
            name: 'Home',
            url: '/',
        }
    ]

    // Only add category path if categories exists
    if (categories) {
        paths.push({
            name: formatText(categories),
            url: `/category/${formatUrl(categories)}`,
        })
    }

    // Only add blog path if both categories and blog exist
    if (categories && blog) {
        paths.push({
            name: formatText(blog),
            url: `/category/${formatUrl(categories)}/${formatUrl(blog)}`,
        })
    }

    return (
        <Container>
            <div className="flex items-center gap-2 py-4 text-sm md:text-base text-gray-600">
                {paths.map((path, index) => (
                    <React.Fragment key={path.url}>
                        {index > 0 && (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                        {index === paths.length - 1 ? (
                            <span className="font-semibold text-black">
                                {path.name}
                            </span>
                        ) : (
                            <Link
                                href={path.url}
                                className="hover:text-primary transition-colors"
                            >
                                {path.name}
                            </Link>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </Container>
    )
}
