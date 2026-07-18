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
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Only notify on brand-new enquiries, not on edits made in the admin panel
        if (operation !== 'create') return

        const notifyTo = process.env.ENQUIRY_NOTIFY_EMAIL
        if (!notifyTo) return

        try {
          await req.payload.sendEmail({
            to: notifyTo,
            subject: `New Enquiry: ${doc.name} (${doc.phone})`,
            html: `
              <h2>New enquiry from AGSR website</h2>
              <p><strong>Name:</strong> ${doc.name}</p>
              <p><strong>Phone:</strong> ${doc.phone}</p>
              ${doc.email ? `<p><strong>Email:</strong> ${doc.email}</p>` : ''}
              ${doc.age ? `<p><strong>Age:</strong> ${doc.age}</p>` : ''}
              ${doc.discipline ? `<p><strong>Discipline:</strong> ${doc.discipline}</p>` : ''}
              ${doc.experienceLevel ? `<p><strong>Experience:</strong> ${doc.experienceLevel}</p>` : ''}
              ${doc.preferredBatch ? `<p><strong>Preferred Batch:</strong> ${doc.preferredBatch}</p>` : ''}
              ${doc.message ? `<p><strong>Message:</strong> ${doc.message}</p>` : ''}
              <p><a href="${process.env.NEXT_PUBLIC_SERVER_URL || ''}/admin/collections/enquiries/${doc.id}">View in Admin</a></p>
            `,
          })
        } catch (err) {
          // Never let an email failure block the enquiry from being saved
          req.payload.logger.error(`Failed to send enquiry notification email: ${err}`)
        }
      },
    ],
  },
}
