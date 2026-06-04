const Enquiries = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'discipline', 'status', 'createdAt'],
    group: 'Academy',
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
      label: 'Phone Number',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
    },
    {
      name: 'ageGroup',
      type: 'select',
      label: 'Age Group',
      options: [
        { label: 'Under 14', value: 'under-14' },
        { label: '14–18', value: '14-18' },
        { label: '18–25', value: '18-25' },
        { label: '25+', value: '25+' },
      ],
    },
    {
      name: 'discipline',
      type: 'select',
      label: 'Discipline',
      options: [
        { label: '10m Air Pistol', value: '10m-air-pistol' },
        { label: '10m Air Rifle', value: '10m-air-rifle' },
        { label: '25m Pistol', value: '25m-pistol' },
        { label: '50m Pistol', value: '50m-pistol' },
        { label: 'Not sure yet', value: 'unsure' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Followed Up', value: 'followed' },
        { label: 'Enrolled', value: 'enrolled' },
        { label: 'Not Interested', value: 'closed' },
      ],
      defaultValue: 'new',
      admin: { position: 'sidebar' },
    },
  ],
}

module.exports = Enquiries
