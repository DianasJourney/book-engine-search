import { gql } from '@apollo/client'
//importing our gpl from apollo where we create queries and export into the database
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

