import {
  adminOnly,
  adminOrOwner,
  anyone,
  authenticated,
} from '@/access/collectionAccess'
import { notAdminView } from '@/access/collectionView'
import {
  adminExceptSelfFieldAccess,
  adminOnlyFieldAccess,
} from '@/access/fieldAccess'
import type { CollectionConfig } from 'payload'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { preventCreateAdmin } from './hooks/preventCreateAdmin'
import { preventDeleteAdminOrSelf } from './hooks/preventDeleteAdminOrSelf'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: adminOnly,
    delete: adminOnly,
    read: anyone,
    update: adminOrOwner,
  },
  admin: {
    defaultColumns: ['name', 'email', 'title', 'role', 'createdAt'],
    useAsTitle: 'firstName',
    hidden: notAdminView,
  },
  auth: {
    // Enables email login, password hashing, and token handling
    // verify: {
    // generateEmailHTML: ({ req, token, user }) => {
    //   // Use the token provided to allow your user to verify their account
    //   const url = `https://yourfrontend.com/verify?token=${token}`
    //   return `Hey ${user.email}, verify your email by clicking here: ${url}`
    // },
    // },
    tokenExpiration: 60 * 60 * 24, // 1 day
    verify: false,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: 'First Name',
      hooks: {
        beforeChange: [({ data }) => data?.first_name?.trim()],
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      label: 'Last Name',
      hooks: {
        beforeChange: [({ data }) => data?.last_name?.trim()],
      },
    },
    {
      name: 'fullname',
      type: 'text',
      label: 'Full Name',
      admin: {
        readOnly: true,
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => `${data?.firstName || ''} ${data?.lastName || ''}`,
        ],
      },
      index: true,
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Active Account',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
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
      name: 'avatar',
      label: 'Avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
      filterOptions: ({ user }) => {
        if (!user) return false
        if (user.role === 'admin') return true
        return {
          createdBy: {
            equals: user.id,
          },
        }
      },
    },
    {
      name: 'organization',
      type: 'text',
      label: 'Organization / Institution',
    },
    {
      name: 'medicalLicenseNumber',
      type: 'text',
      label: 'Medical License Number',
    },
    {
      name: 'specialization',
      type: 'text',
      label: 'Specialization',
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Mailing Address',
    },
    {
      name: 'role',
      type: 'select',
      label: 'User Role',

      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminExceptSelfFieldAccess,
      },
      defaultValue: 'user',
      hasMany: false,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin, preventCreateAdmin],
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Modifier',
          value: 'modifier',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
    },
  ],
  hooks: {
    afterLogin: [
      // async ({ user, req, token }) => {
      // You can access:
      // user → the logged-in user document
      // req  → the request object
      // token → the JWT access token
      // await sendEmail({
      //   to: user.email,
      //   subject: 'Welcome back!',
      //   text: `Hi ${user.firstName || ''}, you just logged in successfully.`,
      // })
      // },
    ],
    beforeDelete: [preventDeleteAdminOrSelf],
  },
  timestamps: true,
}
