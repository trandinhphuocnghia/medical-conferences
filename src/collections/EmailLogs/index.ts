import { CollectionConfig } from 'payload'

export const MailLogs: CollectionConfig = {
  slug: 'mail-logs',
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  admin: {
    useAsTitle: 'subject',
    group: 'System',
    defaultColumns: ['to', 'source', 'status', 'retryCount', 'createdAt', 'abstractId', 'courseApplicationId'],
    components: {
      //   beforeList: [ProcessLogsButton as any as CustomComponent], //<- NOTE: comment out before generate:importmap.
    },
  },
  fields: [
    { name: 'to', type: 'text', required: true },
    { name: 'subject', type: 'text', required: true },
    { name: 'html', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
        { label: '💀 Dead Letter', value: 'dead-letter' },
      ],
    },
    { name: 'retryCount', type: 'number', defaultValue: 0 },
    { name: 'lastError', type: 'text' },
    { name: 'sentAt', type: 'date' },
    {
      name: 'abstractId',
      type: 'relationship',
      relationTo: 'abstracts',
    },
    // ── Source tag — set once at creation, immutable thereafter ───────────────
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Abstract', value: 'abstract' },
        { label: 'Course Application', value: 'course-application' },
        { label: 'System', value: 'system' },
      ],
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      access: {
        // Prevent any API caller from mutating the source after creation
        update: () => false,
      },
    },
    {
      name: 'courseApplicationId',
      type: 'relationship',
      relationTo: 'course-applications',
      admin: { position: 'sidebar' },
    },
  ],
}
