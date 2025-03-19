
export type Contact = {

type: string
locationId: string
id: string
address1?: string
city?: string
companyName?: string
country?: string
source?: string
dateAdded?: string
dateOfBirth?: string
dnd?: boolean
email?: string
name?: string
firstName?: string
lastName?: string
phone?: string
postalCode?: string
state?: string
tags?: string[]
website? : string
attachments?: string[]
assignedTo?: string
customFields?: customFields[]
}

type customFields = {
  id: string
  value: string | number | Array<string> | object
}



export type Note = {
  type?: string
  locationId: string
  id: string
  body?: string
  contactId: string
  dateAdded?: string 
}