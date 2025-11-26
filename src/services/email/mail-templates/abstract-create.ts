interface IAbstractCreateMail {
  userName: string
  abstractTitle: string
  abstractLink: string
}

export const abstractCreateMail = ({
  userName,
  abstractTitle,
  abstractLink,
}: IAbstractCreateMail) => `
  Hello ${userName},

Thank you for submitting your abstract titled "${abstractTitle}".  

Your submission has been successfully received and is currently under review.  

You can view your submission here: ${abstractLink}

We will notify you once the review process is complete.  

Best regards,
Medconf
`
