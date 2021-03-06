import { gql } from '@apollo/client';

export const GET_QUIZZES = gql`
    {
        getQuizzes {
            _id
            title
            user {
                _id
                displayName
                iconImage
            }
            icon
            description
            category
            quizTimer
            numAttempts
            numFavorites
            numRatings
            rating
            isFeatured
        }
    }
`;

export const GET_FEATURED_QUIZZES = gql`
    {
        getFeaturedQuizzes {
            _id
            title
            user {
                _id
                displayName
                iconImage
            }
            icon
            description
            category
            quizTimer
            numAttempts
            numFavorites
            numRatings
            rating
            isFeatured
        }
    }
`;

export const GET_NEWEST_QUIZZES = gql`
    {
        getNewestQuizzes {
            _id
            title
            user {
                _id
                displayName
                iconImage
            }
            icon
            description
            category
            quizTimer
            numAttempts
            numFavorites
            numRatings
            rating
            isFeatured
        }
    }
`;

export const GET_BEST_QUIZZES = gql`
    {
        getBestQuizzes {
            _id
            title
            user {
                _id
                displayName
                iconImage
            }
            icon
            description
            category
            quizTimer
            numAttempts
            numFavorites
            numRatings
            rating
            isFeatured
        }
    }
`;

export const GET_QUIZ = gql`
    query GetQuiz($quizId: ID!) {
        getQuiz(quizId: $quizId) {
            _id
            title
            user {
                _id
                displayName
                iconImage
            }
            questions {
                question
                answerChoices
                answer
                questionType
            }
            icon
            description
            category
            quizTimer
            numQuestions
            numAttempts
            numFavorites
            rating
            numRatings
            averageScore
            medianScore
            quizInstant
            quizShuffled
            comments {
                _id
                user {
                    _id
                    displayName
                    iconImage
                }
                comment
                replies {
                    _id
                    user {
                        _id
                        displayName
                        iconImage
                    }
                    reply
                    createdAt
                }
                createdAt
            }
        }
    }
`;

export const GET_QUIZ_OF_THE_DAY = gql`
    {
        getQuizOfTheDay {
            _id
            title
            user {
                _id
                displayName
                iconImage
            }
            icon
            description
            category
            quizTimer
            numQuestions
            numAttempts
            numFavorites
            rating
            quizInstant
            quizShuffled
        }
    }
`;

export const GET_QUIZ_ATTEMPT = gql`
    query GetQuizAttempt($_id: ID!) {
        getQuizAttempt(_id: $_id) {
            _id
            user {
                _id
                displayName
                iconImage
            }
            quiz {
                _id
                user {
                    displayName
                }
                title
                questions {
                    question
                    answerChoices
                    answer
                    questionType
                }
                description
                quizTimer
                numQuestions
                numAttempts
                numFavorites
                averageScore
                medianScore
                comments {
                    comment
                    replies {
                        reply
                    }
                }
            }
            score
            numCorrect
            answerChoices
            questions
            elapsedTime
            attemptNumber
            coinsEarned
            comments {
                user {
                    displayName
                }
                comment
            }
        }
    }
`;

export const SEARCH_QUIZZES = gql`
    query Query($searchText: String!, $page: Int!, $sortType: String) {
        searchQuizzes(searchText: $searchText, page: $page, sortType: $sortType) {
            _id
            title
            description
            numQuestions
            icon
            rating
            numAttempts
            numFavorites
            quizInstant
            quizShuffled
            questionTimer
            quizTimer
            isTimerForQuiz
            platform {
                _id
                name
            }
            user {
                _id
                displayName
                iconImage
            }
            createdAt
        }
    }
`;

export const GET_LEADERBOARD = gql`
    query GetLeaderboard($quiz_id: ID!) {
        getLeaderboard(quiz_id: $quiz_id) {
            _id
            user {
                _id
                displayName
                iconImage
            }
            score
            elapsedTime
        }
    }
`;

export const GET_POST_RECOMMENDATIONS = gql`
    query GetPostRecommendations($quiz_id: ID!) {
        getPostRecommendations(quiz_id: $quiz_id) {
            _id
            title
            icon
            user {
                _id
                displayName
            }
            numFavorites
            numAttempts
        }
    }
`;

export const GET_USER_RECOMMENDATIONS = gql`
    query GetUserRecommendations($user_id: ID!) {
        getUserRecommendations(user_id: $user_id) {
            _id
            title
            user {
                _id
                displayName
            }
            icon
            description
            category
            quizTimer
            numAttempts
            numFavorites
            numRatings
            rating
        }
    }
`;

export const GET_PLATFORMS = gql`
    {
        getPlatforms {
            _id
            name
            iconImage
            bannerImage
            background
            tags
            followers {
                _id
                displayName
                iconImage
            }
            quizzes {
                _id
            }
        }
    }
`;

export const GET_PLATFORM_OF_THE_DAY = gql`
    {
        getPlatformOfTheDay {
            _id
            name
            iconImage
            bannerImage
            background
            tags
            description
            followers {
                _id
            }
            quizzes {
                _id
                title
            }
            user {
                _id
                displayName
                iconImage
            }
        }
    }
`;

export const GET_PLATFORM = gql`
    query getPlatform($platformId: ID!) {
        getPlatform(platformId: $platformId) {
            _id
            name
            iconImage
            bannerImage
            background
            followers {
                _id
                displayName
                iconImage
            }
            tags
            description
            user {
                _id
                displayName
                quizzesMade {
                    _id
                    title
                    numAttempts
                    numFavorites
                    icon
                    rating
                    numRatings
                    averageScore
                    medianScore
                }
            }
            quizzes {
                _id
                title
                icon
                numFavorites
                numAttempts
            }
            playlists {
                _id
                name
                quizzes {
                    _id
                    title
                    icon
                    numFavorites
                    numAttempts
                }
            }
            posts {
                _id
                user {
                    _id
                    displayName
                    iconImage
                }
                replies {
                    _id
                    user {
                        _id
                        displayName
                        iconImage
                    }
                    reply
                    createdAt
                }
                postText
                postImage
                createdAt
                numLikes
                likedBy {
                    _id
                }
            }
        }
    }
`;

export const SEARCH_PLATFORMS = gql`
    query searchPlatform($searchText: String!, $page: Int!, $sortType: String) {
        searchPlatforms(searchText: $searchText, page: $page, sortType: $sortType) {
            _id
            name
            iconImage
            bannerImage
            followers {
                _id
            }
            quizzes {
                _id
            }
            description
            createdAt
        }
    }
`;

export const GET_USERS = gql`
    {
        getUsers {
            _id
            displayName
            iconImage
            currency
        }
    }
`;

export const GET_USER = gql`
    query ($_id: ID!) {
        getUser(_id: $_id) {
            _id
            displayName
            iconImage
            bio
            email
            title
            bannerImage
            quizzesMade {
                _id
                title
                numAttempts
                numFavorites
                icon
                rating
                numRatings
                averageScore
                medianScore
                user {
                    displayName
                }
            }
            platformsMade {
                _id
                iconImage
                bannerImage
                name
                user {
                    displayName
                }
                followers {
                    _id
                    displayName
                }
                quizzes {
                    _id
                }
            }
            featuredQuizzes {
                _id
                title
                numAttempts
                numFavorites
                icon
                rating
                user {
                    displayName
                }
            }
            featuredPlatforms {
                _id
                iconImage
                bannerImage
                name
                user {
                    displayName
                }
                followers {
                    _id
                    displayName
                }
                quizzes {
                    _id
                }
            }
            following {
                _id
                iconImage
                bannerImage
                name
                user {
                    displayName
                }
                followers {
                    _id
                    displayName
                }
                quizzes {
                    _id
                }
            }
            favoritedQuizzes {
                _id
                title
                numAttempts
                numFavorites
                icon
                rating
                user {
                    iconImage
                    displayName
                }
            }
            bannerEffect {
                _id
                name
                item
            }
            ownedBannerEffects {
                _id
                name
                item
            }
            iconEffect {
                _id
                name
                item
            }
            ownedIconEffects {
                _id
                name
                item
            }
            background {
                _id
                name
                item
            }
            ownedBackgrounds {
                _id
                name
                item
            }
            darkMode
        }
    }
`;

export const SEARCH_USERS = gql`
    query searchUsers($searchText: String!, $page: Int!, $sortType: String) {
        searchUsers(searchText: $searchText, page: $page, sortType: $sortType) {
            _id
            displayName
            iconImage
            createdAt
        }
    }
`;

export const GET_SHOP_ITEMS = gql`
    {
        getShopItems {
            _id
            type
            name
            template
            item
            price
            weeklySpecial
        }
    }
`;

export const GET_RATING = gql`
    query ($quizId: ID!, $userId: ID!) {
        getRating(quizId: $quizId, userId: $userId)
    }
`;

export const GET_USER_QUIZ_ATTEMPTS = gql`
    query ($quizId: ID!, $userId: ID!) {
        getUsersQuizAttempts(quizId: $quizId, userId: $userId) {
            score
            elapsedTime
            createdAt
            _id
        }
    }
`;
