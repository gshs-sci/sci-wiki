import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://sciwiki.org',
      priority: 1,
    },
    {
      url: 'https://sciwiki.org/recents',
      priority: 0.8,
    },
    {
      url: 'https://sciwiki.org/login',
      priority: 0.5,
    },
  ]
}