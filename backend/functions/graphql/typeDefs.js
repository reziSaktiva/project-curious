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
        repost: Repost
        subscribe: [Subscribe]
        
    }
    type Repost {
        id: ID
        owner: String
        text: String
        media: [String]
        createdAt: String
        location: LatLong
    }
    type LatLong {
        lat: Float
        lng: Float
    }
    type GeoLocation {
        administrative_area_level_4: String
        administrative_area_level_3: String
        administrative_area_level_2: String
        administrative_area_level_1: String
        country: String
        location: LatLong
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
        id: ID
        createdAt: String
        owner: String
        text: String
        photoProfile: String
        displayName: String
        displayImage: String
        colorCode: String
        replay: ReplayData
        replayList: [Comment]!
    },
    
    input Replay {
        username: String
        id: ID
    },
    
    type ReplayData {
        username: String
        id: ID
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
        owner: String!
        createdAt: String!
        postId: ID!
        displayName: String!
        displayImage: String!
        colorCode: String!
        isSubscribe: Boolean
    },
    type DataSubscribe {
        owner: String!
        createdAt: String!
        postId: ID!
        isSubscribe: Boolean
    }
    type Query {
        getPosts(lat: Float, lng: Float, range: Float): [Post]!
        getPopularPosts(lat: Float, lng: Float range: Float): [Post]!
        getVisited: [GeoLocation]
        getProfilePosts: [Post]!
        getProfileLikedPost: [Post]!
        getPost(id: ID!): Post!
        getUserData: UserData
        getPostBasedOnNearestLoc(lat: String, lng: String): [Post]
        mutedPosts: [Post]!
        getSubscribePosts: [Post]!
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
    input GoogleData {
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
        registerUser(registerInput: RegisterInput): String!
        login(username: String!, password: String!): String!
        loginWithFacebook(username: String!, token: String!): User!
        registerUserWithFacebook(facebookData: FacebookData): User!
        registerUserWithGoogle(googleData: GoogleData): User!
        checkUserWithFacebook(username: String!): Boolean!
        checkUserWithGoogle(username: String!): Boolean!
        readNotification( id: ID! ): Notification!
        changePPUser( url : String! ): String!

        # posts mutation
        getPost( id:ID! ): Post!
        nextPosts( id:ID! lat: Float, lng: Float ): [Post]!
        nextPopularPosts( id:ID! lat: Float, lng: Float ): [Post]!
        createPost(text:String, media: [String] location: Location!, repost: String): Post!
        subscribePost( postId: ID! ): Subscribe!
        mutePost ( postId:ID! ): Mute!
        deletePost(id:ID!): String!
        likePost(id: ID!): Like

        # comments mutation
        createComment( id:ID!, text: String!, replay: Replay ): Comment!
        deleteComment( postId: ID!, commentId: ID! ): String!
    }
`