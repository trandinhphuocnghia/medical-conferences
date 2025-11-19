'use server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'


export async function getConferenceAbstracts({submitterId,conferenceId}:{
    submitterId: string,
    conferenceId:string
}) {
  try {
    const payload = await getPayload({ config: configPromise })

    const res = await payload.find({
      collection: 'abstracts',
      overrideAccess: false,
      
      where: {
     

       conference: {
            equals: conferenceId
        },
    and: [{
         submitter: {
        equals: submitterId,
      },
    }]
    },
    })

    return { success: true, abstracts:res?.docs }
  } catch (error) {
    return { success: false, error }
  }
}
