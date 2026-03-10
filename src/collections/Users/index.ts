import { adminOnly, adminOrOwner, anyone, authenticated } from '@/access/collectionAccess'
import { notAdminView } from '@/access/collectionView'
import { adminExceptSelfFieldAccess, adminOnlyFieldAccess } from '@/access/fieldAccess'
import { bioLexical } from '@/fields/bioLexical'
import type { CollectionConfig } from 'payload'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { handleSourceBasedUserLogic } from './hooks/handleSourceBasedUserLogic'
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
    tokenExpiration: 60 * 60 * 24, // 1 day
    verify: false,
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'User Type & Status',
          fields: [
            {
              type: 'ui',
              name: 'generateCredentials',
              admin: {
                components: {
                  Field: '@/collections/Users/ui/GenerateCredentialsButton#GenerateCredentialsButton',
                },
              },
            },
            {
              name: 'email',
              type: 'email',
              label: 'Email Address',
              required: true,
              unique: true,
            },
            {
              name: 'role',
              type: 'select',
              index: true,
              label: 'User Role',
              saveToJWT: true,
              access: {
                create: adminOnlyFieldAccess,
                read: ({ req: { user }, doc }) => {
                  if (!user) return false
                  if (user.role === 'admin') return true
                  // Users can read their own role (e.g. for useAuth() in admin UI)
                  return String(user.id) === String(doc?.id)
                },
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
              name: 'source',
              type: 'select',
              required: true,
              defaultValue: 'admin-created',
              options: [
                { label: 'Created By Admin', value: 'admin-created' }, // For: admin pannel.
                { label: 'Public Registration', value: 'registration' }, // For: public website, register action.
              ],
              admin: {
                position: 'sidebar',
                description: 'How this user was created in the system.',
              },
              access: {
                update: adminOnlyFieldAccess,
              },
            },
            {
              name: 'registrationType',
              type: 'select',
              defaultValue: 'standard',
              options: [
                { label: 'Invited Speaker', value: 'invited' },
                { label: 'Standard Participant', value: 'standard' },
              ],
              admin: {
                position: 'sidebar',
                description: 'Used to highlight keynote/invited speakers on the conference page.',
              },
            },
          ],
        },
        {
          label: 'User Information',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'firstName',
                  type: 'text',
                  required: true,
                  label: 'First Name',
                  hooks: {
                    beforeChange: [({ data }) => data?.firstName?.trim()],
                  },
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'lastName',
                  type: 'text',
                  required: true,
                  label: 'Last Name',
                  hooks: {
                    beforeChange: [({ data }) => data?.lastName?.trim()],
                  },
                  admin: {
                    width: '50%',
                  },
                },
              ],
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
                beforeChange: [({ data }) => `${data?.firstName || ''} ${data?.lastName || ''}`],
              },
              index: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'organization',
                  type: 'text',
                  label: 'Organization / Institution',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'medicalLicenseNumber',
                  type: 'text',
                  label: 'Medical License Number',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'specialization',
                  type: 'text',
                  label: 'Specialization',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'phoneNumber',
                  type: 'text',
                  label: 'Phone Number',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'address',
              type: 'textarea',
              label: 'Mailing Address',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'select',
                  label: 'Title',
                  options: ['Dr.', 'Prof.', 'Mr.', 'Ms.', 'Mx.'],
                  hasMany: false,
                  admin: {
                    width: '30%',
                  },
                },
                {
                  name: 'degrees',
                  type: 'text',
                  label: 'Suffixes / Degrees',
                  admin: {
                    width: '70%',
                    placeholder: 'e.g. MD, PhD',
                  },
                },
              ],
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
          ],
        },
        {
          label: 'Highlight Information',
          fields: [
            {
              name: 'bio',
              type: 'richText',
              editor: bioLexical,
              label: 'Professional Bio',
              admin: {
                description: 'A summary for the conference presenter profile. Supports images.',
              },
            },
            {
              name: 'interests',
              type: 'relationship',
              relationTo: 'topics',
              hasMany: true,
              label: 'Areas of Interest',
              admin: {
                position: 'sidebar',
                description: 'Select medical topics you are interested in.',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [handleSourceBasedUserLogic],
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
