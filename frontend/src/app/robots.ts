import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/student/dashboard/'],
    },
    sitemap: 'https://toeflin.my.id/sitemap.xml',
  }
}
