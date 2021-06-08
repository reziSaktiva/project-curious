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
        repostCount: Int!
        comments: [Comment]
        likes: [Like]
        muted: [Mute]
        repost: Repost
        subscribe: [Subscribe],
        hastags: [String]
        room: String
    }
    type Search {
        hits: [Post]
        page: Int
        nbHits: Int
        nbPages: Int
        hitsPerPage: Int
        processingTimeMS: Float
    }
    # type Repost {
    #     repost: String
    #     room: String
    # }
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
        photo: String
        displayName: String
        displayImage: String
        colorCode: String
        replay: ReplayData
        replayList: [Comment]
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
        getRoomPosts(room: String!):[Post]!
        getProfileLikedPost: [Post]!
        getPost(id: ID! room: String): Post!
        getUserData: UserData
        getPostBasedOnNearestLoc(lat: String, lng: String): [Post]
        mutedPosts: [Post]!
        getSubscribePosts: [Post]!
        textSearch(search: String, perPage: Int, page: Int, range: Float, location: Location ): Search!
        setRulesSearchAlgolia(index: String!, rank: [String]!): String
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
    input Data {
        repost: String
        room: String
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
        readAllNotification: [Notification]
        changePPUser( url : String! ): String!
        clearAllNotif: String!
        deleteAccount( id: ID! ): String!

        # posts mutation
        nextPosts( id:ID! lat: Float, lng: Float ): [Post]!
        nextRoomPosts( id:ID!, room: String ): [Post]!
        nextPopularPosts( id:ID! lat: Float, lng: Float ): [Post]!
        createPost(text:String, media: [String] location: Location! repost: Data room: String): Post!
        subscribePost( postId: ID! room: String ): Subscribe!
        mutePost ( postId: ID! room: String ): Mute!
        deletePost( id: ID! room: String ): String!
        likePost(id: ID! room:String ): Like

        # comments mutation
        createComment( id:ID!, text: String!, replay: Replay, photo: String ): Comment!
        deleteComment( postId: ID!, commentId: ID! ): String!
    }
`