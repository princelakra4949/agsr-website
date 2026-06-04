import type { CollectionConfig } from 'payload'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'discipline', 'status', 'createdAt'],
    description: 'Enquiries submitted via the contact form on the website',
  },
  access: {
    // Only admins can read/update enquiries; public can create (submit form)
    create: () => true,
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Phone / WhatsApp',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'age',
      type: 'number',
    },
    {
      name: 'discipline',
      type: 'select',
      options: [
        { label: '10m Air Pistol', value: 'air-pistol-10m' },
        { label: '10m Air Rifle', value: 'air-rifle-10m' },
        { label: '25m Pistol', value: 'pistol-25m' },
        { label: '50m Free Pistol', value: 'free-pistol-50m' },
        { label: 'Not Sure Yet', value: 'undecided' },
      ],
    },
    {
      name: 'experienceLevel',
      type: 'select',
      label: 'Experience Level',
      options: [
        { label: 'Complete Beginner', value: 'beginner' },
        { label: 'Some Experience', value: 'intermediate' },
        { label: 'Competitive Shooter', value: 'competitive' },
      ],
    },
    {
      name: 'preferredBatch',
      type: 'select',
      label: 'Preferred Batch',
      options: [
        { label: 'Morning (5 AM – 8 AM)', value: 'morning' },
        { label: 'Afternoon (12 PM – 3 PM)', value: 'afternoon' },
        { label: 'Evening (5 PM – 9 PM)', value: 'evening' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Enrolled', value: 'enrolled' },
        { label: 'Not Interested', value: 'not-interested' },
      ],
      defaultValue: 'new',
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes (not visible to the enquirer)',
      },
    },
  ],
  timestamps: true,
}
