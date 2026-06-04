import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: true,
  admin: {
    useAsTitle: 'alt',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image for accessibility',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Gallery', value: 'gallery' },
        { label: 'Blog', value: 'blog' },
        { label: 'Achievement', value: 'achievement' },
        { label: 'General', value: 'general' },
      ],
      defaultValue: 'general',
    },
  ],
}
