const BlogPosts = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'createdAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Post Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'e.g. why-air-pistol-best-beginner',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Short Description',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Article Content',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover Image',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { label: 'Training', value: 'training' },
        { label: 'Technique', value: 'technique' },
        { label: 'Equipment', value: 'equipment' },
        { label: 'News', value: 'news' },
        { label: 'Academy', value: 'academy' },
        { label: 'General', value: 'general' },
      ],
      defaultValue: 'general',
    },
    {
      name: 'tags',
      type: 'text',
      label: 'Tags (comma separated)',
    },
    {
      name: 'author',
      type: 'text',
      label: 'Author Name',
      defaultValue: 'AGSR Team',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
    },
  ],
}

module.exports = BlogPosts
