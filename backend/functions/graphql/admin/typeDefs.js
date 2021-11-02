const gql = require('graphql-tag');

module.exports = gql`
    type Admin {
        id: ID!
        email: String
        name: String
    }
    type Query {
        getAdmin: [Admin]
    }
    type Mutation {
        checkEmail(email: String): Boolean
    }
`