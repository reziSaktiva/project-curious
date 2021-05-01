const gql = require('graphql-tag')

module.exports = gql`
    type Post {
        id: ID!
        owner: String!
        text: String!
        media: [String]
        createdAt: String!
        location: LatLong
        likeCount: Int!
        commentCount: Int!
        comments: [Comment]
        likes: [Like]
        muted: [Mute]
    }
    type LatLong {
        lat: Float
        lng: Float
    }
    type User {
        id: ID!
        username: String!
        email: String!
        mobileNumber: Float!
        gender: String!
        birthday: String!
        createdAt: String!
        profilePicture: String!
        token: String
    },
    type Comment {
        id: ID!
        createdAt: String!
        owner: String!
        text: String!
        displayName: String!
        photoProfile: String
        colorCode: String!
    },
    type Like {
        id: ID!
        owner: String!
        createdAt: String!
        displayName: String!
        displayImage: String!
        colorCode: String!
        isLike: Boolean
    },
    type Notification {
        recipient: String!
        sender: String!
        read: Boolean!
        postId: ID!
        id: ID!
        type: String!
        createdAt: String!
        displayName: String!
        displayImage: String!
        colorCode: String!
    },
    type Mute {
        id:ID!
        owner: String!
        createdAt: String!
        postId: ID!
        mute: Boolean
    }
    type UserData {
        user: User!
        notifications: [Notification]
        liked: [Like]
    },
    type Subscribe {
        postId: ID!
        owner: String!
        createdAt: String!
        displayName: String!
        displayImage: String!
        colorCode: String!
    },
    type Query {
        getPosts: [Post]!
        getPost(id: String!): Post!
        getUserData: UserData
        getPostBasedOnNearestLoc(lat: String, lng: String): [Post]
    },
    input RegisterInput {
        email: String!
        mobileNumber: String!
        username: String!
        password: String!
        birthday: String!
        gender: String
    },
    input FacebookData {
        id: String!
        username: String!
        email: String!
        imageUrl: String!
        token: String!
        mobileNumber: String!
        gender: String!
        birthday: String!
    },
    input Location {
        lat: Float
        lng: Float
    }
    type Mutation {
        # users mutation
        registerUser(registerInput: RegisterInput): User!
        login(username: String!, password: String!): String!
        loginWithFacebook(username: String!, token: String!): User!
        registerUserWithFacebook(facebookData: FacebookData): User!
        checkUserWithFacebook(username: String!): Boolean!

        # posts mutation
        getPost( id:ID! ): Post!
        nextPosts( id:ID! ): [Post]!
        createPost(text:String, media: [String] location: Location!): Post!
        subscribePost( postId: ID! ): Subscribe!
        mutePost ( postId:ID! ): Mute!
        deletePost(id:ID!): String!
        likePost(id: ID!): Like

        # comments mutation
        createComment( id:ID!, text: String! ): Comment!
        deleteComment( postId: ID!, commentId: ID! ): String!
    }
`