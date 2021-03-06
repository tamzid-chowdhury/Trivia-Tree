import { Box, Grid, Text, Center, VStack, Select, Spinner, Button, NumberInput, NumberInputField, Flex, Spacer, HStack,
    IconButton, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Tag, TagLabel, useColorModeValue } from "@chakra-ui/react"
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { SEARCH_QUIZZES, SEARCH_PLATFORMS, SEARCH_USERS } from "../cache/queries";
import QuizResult from '../components/SearchResults/QuizResult'
import PlatformResult from '../components/SearchResults/PlatformResult'
import UserResult from '../components/SearchResults/UserResult'
import { useState, useEffect } from 'react';
import TimeField from "react-simple-timefield";
import '../styles/styles.css'
import { BsChevronDown } from "react-icons/bs";

export default function SearchResultsPage() {

    const location = useLocation();
    let { searchType, searchText } = useParams();

    const [sortType, setSortType] = useState("sort_newest")
    const [resetResults, setResetResults] = useState(false)
    const [filters, setFilters] = useState( {
        minPlays: 0,
        minFavorites: 0,
        minTimer: "00:00:00",
        minRating: 1,
        minFollowers: 0
    })
    const [isInitQueryDone, setInitQueryDone] = useState(false);

    const [quizData, setQuizData] = useState(() => []);
    const [platformData, setPlatformData] = useState(() => []);
    const [userData, setUserData] = useState(() => []);
    const [page, setPage] = useState(1);
    const [noMoreData, setNoMoreData] = useState(false);
    const [loadingMoreResults, setLoadingMoreResults] = useState(false);

    // Only runs once when the page is first loaded
    useEffect(() => {
        setPage(1)
    }, [])
    
    // Dark Mode Colors
    const inputBgColor = useColorModeValue("white", "#1a202c")

    // let search = location.state.search
    // let searchType = location.state.searchType
    let search = searchText === undefined ? '' : searchText;
    let search_text = 'Search Results for "' + search + '"'

    const quizzes = useQuery(SEARCH_QUIZZES, { skip: (searchType !== 'All' && searchType !== 'Quizzes'), variables: { searchText: search, page: page, sortType: sortType }, fetchPolicy: 'cache-and-network',
        onCompleted({searchQuizzes: data}) {
            setLoadingMoreResults(false)
            if (data.length < 10) {
                setNoMoreData(true);
            }
            setQuizData((prevQuizData) => {
                if (resetResults){
                    setResetResults(false)
                    return data
                }

                let temp = [...prevQuizData];
                return temp.concat(data);
            });
            if (!isInitQueryDone) {
                setInitQueryDone(true);
            }
        }
    })
    const platforms = useQuery(SEARCH_PLATFORMS, { skip: (searchType !== 'All' && searchType !== 'Platforms'), variables: { searchText: search, page: page, sortType: sortType }, fetchPolicy: 'cache-and-network', 
        onCompleted({searchPlatforms: data}) {
            setLoadingMoreResults(false)
            if (data.length < 10) {
                setNoMoreData(true);
            }
            setPlatformData((prevPlatformData) => {
                if (resetResults){
                    setResetResults(false)
                    return data
                }

                let temp = [...prevPlatformData];
                return temp.concat(data);
            });
            if (!isInitQueryDone) {
                setInitQueryDone(true);
            }
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        }
    })
    const users = useQuery(SEARCH_USERS, { skip: (searchType !== 'All' && searchType !== 'Users'), variables: { searchText: search, page: page, sortType: sortType }, fetchPolicy: 'cache-and-network',
        onCompleted({searchUsers: data}) {
            setLoadingMoreResults(false)
            if (data.length < 10) {
                setNoMoreData(true);
            }
            setUserData((prevUserData) => {
                if (resetResults){
                    setResetResults(false)
                    return data
                }

                let temp = [...prevUserData];
                return temp.concat(data);
            });
            if (!isInitQueryDone) {
                setInitQueryDone(true);
            }
        }
    })

    function increasePage() {
        setLoadingMoreResults(true)

        setPage((prevPage) => {
            return prevPage + 1;
        });
        if (searchType === 'Quizzes') {
            quizzes.refetch();
        } else if (searchType === 'Platforms') {
            platforms.refetch();
        } else if (searchType === 'Users') {
            users.refetch();
        }
    }

    const loading = quizzes.loading || platforms.loading || users.loading
    const error = quizzes.error || platforms.error || users.error

    // Loading Screen
    if (loading && !isInitQueryDone) {
        return (
            <Center>
                <Spinner marginTop='50px' size='xl' />
            </Center>
        );
    }

    if (!isInitQueryDone) {
        return (
            <Center>
                <Spinner marginTop='50px' size='xl' />
            </Center>
        );
    }

    // Error Screen
    if (error) {
        console.log(error)
        return (
            <Center>
                <Text fontSize="3vw" fontWeight="thin"> Sorry, something went wrong </Text>
            </Center>
        );
    }

    // Doing the actual filtering work
    let filtered_quiz_data = quizData.filter((quiz) => {
        return (quiz.numAttempts >= filters.minPlays) && (quiz.numFavorites >= filters.minFavorites) && (quiz.quizTimer >= filters.minTimer)
    })

    let filtered_platform_data = platformData.filter((platform) => {
        return platform.followers.length >= filters.minFollowers
    })

    // Gather all search results
    let search_results = getSearchResults(searchType, filtered_quiz_data, filtered_platform_data, userData)
    // search_results = sortSearchResults(search_results, sortType)

    // Puts the correct data into the search results array (Depending on if the user serached for quizzes, platforms, users, or all)
    function getSearchResults(searchType, quiz_data, platform_data, user_data) {
        let search_results = []
        
        switch(searchType) {
            case "All":
                search_results = search_results.concat(quiz_data)
                search_results = search_results.concat(platform_data)
                search_results = search_results.concat(user_data)
                break
            case "Quizzes":
                search_results = search_results.concat(quiz_data)
                break
            case "Platforms":
                search_results = search_results.concat(platform_data)
                break
            case "Users":
                search_results = search_results.concat(user_data)
                break
        }
        return search_results
    }

    // Sorting Search results
    function sortSearchResults(search_results, sortType) {
        if(sortType === "sort_random")
            return sortRandom(search_results)
        if(sortType === "sort_abc")
            return sortAlphabetical(search_results)
        if(sortType === "sort_popular")
            return sortPopular(search_results)
        if(sortType === "sort_newest")
            return sortNewest(search_results)

        return search_results
    }

    function sortRandom(search_results) {
        return search_results.sort((a, b) => {
            return Math.random() > 0.5 ? 1 : -1
        })
    }

    function sortAlphabetical(search_results) {
        return search_results.sort((a, b) => {
            let resultA = getName(a)
            let resultB = getName(b)
            return resultA > resultB ? 1 : -1
        })
    }
    
    function sortPopular(search_results) {
        return search_results.sort((a, b) => {
            let resultA = getPopularity(a)
            let resultB = getPopularity(b)
            return resultA < resultB ? 1 : -1
        })
    }

    function sortNewest(search_results) {
        return search_results.sort((a, b) => {
            let resultA = a.createdAt
            let resultB = b.createdAt
            return resultA < resultB ? 1 : -1
        })
    }

    // Determines if this is a quiz/platform/user and returns the appropriate name value
    function getName(x) {
        if (x.__typename === "Quiz")
            return x.title.toLowerCase()
        if (x.__typename === "Platform")
            return x.name.toLowerCase()
        if (x.__typename === "User")
            return x.displayName.toLowerCase()
        return null
    }

    function getPopularity(x) {
        if (x.__typename === "Quiz")
            return x.numAttempts
        if (x.__typename === "Platform")
            return x.followers.length
        if (x.__typename === "User"){
            console.log(x)
            return 0    // fix
        }
        return null
    }

    function handleChangeFilter(event) {
        event.preventDefault()
        
        // Quiz Filters
        let minPlays = event.target.minPlays.value !== "" ? event.target.minPlays.value : 0
        let minFavs = event.target.minFavs.value !== "" ? event.target.minFavs.value : 0
        // let minRating = event.target.minRating.value !== "" ? event.target.minRating.value : 1
        let minTimer = event.target.minTimer.value
        
        // Platform Filters
        let minFollowers = event.target.minFollowers.value !== "" ? event.target.minFollowers.value : 0

        setFilters({
            minPlays: minPlays,
            minFavorites: minFavs,
            minTimer: minTimer,
            // minRating: minRating,
            minFollowers: minFollowers
        });
      }

    // Render search results to the user
    function renderSearchResults(){
        // Spinner loading if filter has been changes
        if (resetResults)
            return (
                <Center>
                    <Spinner marginTop='50px' size='xl' />
                </Center>
            )

        // No quizzes found
        if (search_results.length === 0)
            return (
                <Center mt="1%">
                    <Text fontSize="2vw" fontWeight="thin"> No results found for "{search}"</Text>
                </Center>
            )
        
        // Show quizzes that matched user's search
        return (
            // Content refers to either a Quiz, Platform, or User
            search_results.map((content, index) => {
                if (content.__typename === "Quiz") {
                    return ( 
                        <QuizResult 
                            key={index}
                            quiz={content}
                        />)
                }

                else if (content.__typename === "Platform") {
                    return (
                        <PlatformResult 
                            key={index}
                            platform={content}
                        />
                    )
                }

                else if (content.__typename === "User") {
                    return (
                        <UserResult 
                            key={index}
                            user={content}
                        />
                    )
                } 
            })
        )

    }

    return (
        <Box data-testid="main-component">
            <Grid templateColumns="1fr 5.75fr" minWidth="700px">

                {/* FILTERS / SORTING */}
                <Box minH="94vh"  boxShadow="md" borderColor="gray.300"> 
                    {/* FILTERS */}
                    <form onSubmit={handleChangeFilter} >
                    <VStack spacing={5} pt="5vh">
                        <Text fontSize="125%" fontWeight="medium" >Filters</Text>
                        <Box w="75%" h="0.15vh" bgColor="gray.300"/>
                        
                        {/* Quiz Label */}
                        <Tag w="fit-content" size="md" variant="outline" colorScheme="blue">
                            <TagLabel> Quiz </TagLabel>
                        </Tag>

                        {/* Minimum Plays */}
                        <VStack spacing={1} w="100%">
                            <Text fontSize="100%"> Minimum Plays </Text>
                            <NumberInput 
                                name="minPlays"
                                w="75%" 
                                min={0}
                            >
                                
                                <NumberInputField textAlign="center" placeholder="Min Plays (Ex: 10)" borderColor="gray.300" />
                            </NumberInput>
                        </VStack>

                        {/* Minimum Favorites */}
                        <VStack spacing={1} w="100%">
                            <Text fontSize="100%"> Minimum Favorites </Text>
                            <NumberInput 
                                name="minFavs"
                                w="75%" 
                                min={0}
                            >
                                
                                <NumberInputField textAlign="center" placeholder="Min Favs (Ex: 10)" borderColor="gray.300" />
                            </NumberInput>
                        </VStack>

                        {/* Timer */}
                        <VStack spacing={1} w="100%">
                            <Text fontSize="100%"> Minimum Timer </Text>
                            <TimeField name="minTimer" showSeconds style={{padding:"4px", width:"75%", height:"40px", border:"1px solid", backgroundColor:inputBgColor, borderRadius:"5px", borderColor:"#cfcfcf", textAlign:"center" }}/>
                        </VStack>

                        {/* Platform Label */}
                        <Tag w="fit-content" size="md" variant="outline" colorScheme="orange">
                            <TagLabel> Platform </TagLabel>
                        </Tag>
                        
                         {/* Minimum Followers */}
                         <VStack spacing={1} w="100%">
                            <Text fontSize="100%"> Minimum Followers </Text>
                            <NumberInput 
                                name="minFollowers"
                                w="75%" 
                                min={0}
                            >
                                
                                <NumberInputField placeholder="Min Followers (Ex: 5)" borderColor="gray.300" />
                            </NumberInput>
                        </VStack>


                        {/* Minimum Rating */}
                        {/* <VStack spacing={1} w="100%">
                            <Text fontSize="100%"> Minimum Rating </Text>
                            <NumberInput 
                                name="minRating"
                                w="75%" 
                                min={1} 
                                max={5}>
                                <NumberInputField placeholder="Min Favs (Ex: 10)" borderColor="gray.300" />
                                
                                <NumberInputStepper> <NumberIncrementStepper /> <NumberDecrementStepper /> </NumberInputStepper>
                            </NumberInput>
                        </VStack> */}

                        <Button type="submit" colorScheme="blue" variant="outline" _focus={{border:"1px solid blue.400"}} load> Apply </Button>

                        {/* <Box h="3vh" />
                        <Box w="75%" h="0.10vh" bgColor="gray.300"/> */}
                    </VStack>
                    </form>
                </Box>

                {/* SEARCH RESULTS */}
                <Box pt="2vh">
                    <Grid templateColumns="4fr 1fr">
                        <Text fontSize="200%" fontWeight="light" pl="3%"> {search_text} </Text>
                        
                        <HStack>
                            <Text> Sort By: </Text>
                            <Select w="fit-content" mr="5%" borderColor="gray.300" borderRadius="10px" onChange={(e) =>  {
                                setSortType(e.target.value)
                                setPage(1) 
                                setResetResults(true)
                                setNoMoreData(false)
                                }}> 
                                <option value="sort_newest">Newest</option>
                                <option value="sort_popular"> Popular </option>
                                <option value="sort_abc">Alphabetical [A-Z]</option>
                            </Select>
                        </HStack>
                    </Grid>
                    <Box w="100%" h="0.2vh" bgColor="gray.300"> </Box>

                    {/* ALL SEARCH RESULTS */}
                    {renderSearchResults()}
                    {!noMoreData && !resetResults ?
                    <Center mt={5} pb={5}>
                        <Button leftIcon={<BsChevronDown/>} isLoading={loadingMoreResults} colorScheme='blue' variant='solid' size="lg" onClick={() => increasePage()} _focus={{outline:"none"}}>
                            Show More
                        </Button>
                    </Center> : 
                    <Box pb={10}></Box>}
                </Box>
            </Grid>
        </Box>
    )
}