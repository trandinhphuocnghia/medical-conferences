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
    defaultColumns: ['to', 'status', 'retryCount', 'createdAt', 'abstractId'],
    components: {
      //  beforeList: [ProcessLogsButton as any as CustomComponent], //<- NOTE: comment out before generate:importmap.
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
  ],
}
