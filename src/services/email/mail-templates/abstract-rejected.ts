interface IAbstractRejectedMail {
  userName: string
  abstractTitle: string
  rejectionReason: string
}

export const abstractRejectedMail = ({
  userName,
  abstractTitle,
  rejectionReason,
}: IAbstractRejectedMail) => `
Hello ${userName},

We regret to inform you that your abstract titled "${abstractTitle}" has not been accepted for the upcoming conference/event.  

Reason for rejection: ${rejectionReason}  

We appreciate the time and effort you put into your submission and encourage you to submit again in the future.  

Best regards,
Medconf
`
