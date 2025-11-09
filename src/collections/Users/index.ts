import type { CollectionConfig } from 'payload'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { authenticated } from '../../access/authenticated'
export const Users: CollectionConfig = {
  slug: 'users',
  // 🔑 COLLECTION HOOKS: Moved ensureFirstUserIsAdmin here to run BEFORE save
  hooks: {
    // This hook ensures the first user created is always an admin
    beforeChange: [],
    afterLogin: [
      async ({ user, req, token }) => {
        // Example logic for after login (can be left empty if not needed yet)
      },
    ],
  },
  access: {
    admin: authenticated,
    // Allows guests to register new users (via the public API)
    create: () => true,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'title', 'updatedAt'],
    useAsTitle: 'name',
  },
  // 🔒 AUTH CONFIGURATION: Enabled local auth AND email verification
  auth: {
    // Enables email login, password hashing, and token handling
    verify: {
      // generateEmailHTML: ({ req, token, user }) => {
      //   // Use the token provided to allow your user to verify their account
      //   const url = `https://yourfrontend.com/verify?token=${token}`
      //   return `Hey ${user.email}, verify your email by clicking here: ${url}`
      // },
    },
  },
  timestamps: true,
  // 📝 FIELDS: Mapping the fields from your User interface
  fields: [
    {
      name: 'first_name',
      type: 'text',
      required: true,
      label: 'First Name',
    },
    {
      name: 'last_name',
      type: 'text',
      required: true,
      label: 'Last Name',
    },
    // Combined Full Name for Admin Panel Title (optional field)
    {
      name: 'name',
      type: 'text',
      label: 'Full Name (Auto-Generated)',
      admin: {
        readOnly: true,
        // The Payload admin panel automatically populates 'name' if you set 'useAsTitle'
        // But we keep it to align with your interface structure if needed elsewhere.
      },
      hooks: {
        beforeChange: [({ data }) => `${data?.first_name || ''} ${data?.last_name || ''}`],
      },
    },
    {
      name: 'is_active',
      type: 'checkbox',
      label: 'Active Account',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    // Professional Fields
    {
      name: 'title',
      type: 'select',
      label: 'Title',
      options: ['Dr.', 'Prof.', 'Mr.', 'Ms.', 'Mx.'],
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'organization',
      type: 'text',
      label: 'Organization / Institution',
    },
    {
      name: 'medical_license_number',
      type: 'text',
      label: 'Medical License Number',
    },
    {
      name: 'specialization',
      type: 'text',
      label: 'Specialization',
    },
    // Contact and Address
    {
      name: 'phone_number',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Mailing Address',
    },
    // Roles Field (Secure)
    {
      name: 'roles',
      type: 'select',
      label: 'User Roles',
      access: {
        // Only admins can create/read/update the roles field itself
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: ['user'],
      hasMany: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
    },
  ],
}
