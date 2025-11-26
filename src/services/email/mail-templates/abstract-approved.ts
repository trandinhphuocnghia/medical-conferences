interface IAbstractApprovedMail {
  userName: string
  abstractTitle: string
  abstractLink: string
}

export const abstractApprovedMail = ({
  userName,
  abstractTitle,
  abstractLink,
}: IAbstractApprovedMail) => `
Hello ${userName},

Congratulations! Your abstract titled "${abstractTitle}" has been approved for the upcoming conference/event.  

You can view the details of your approved submission here: ${abstractLink}

Thank you for your contribution, and we look forward to your participation.  

Best regards,
Medconf
`
