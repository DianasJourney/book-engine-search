import { gql } from '@apollo/client'
//importing our gpl from apollo where we can grab our queries into the database
export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`

