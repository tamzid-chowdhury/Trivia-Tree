import { Box, Input, Grid, Text, Select, Button, Icon, HStack, Image, Spacer, Menu, MenuButton, MenuList, MenuItem, Flex, Avatar,
    AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useColorMode, useColorModeValue, IconButton } from "@chakra-ui/react"
import { SearchIcon, HamburgerIcon, SunIcon } from '@chakra-ui/icons'
import { BsCollectionFill, BsFillCartFill, BsFillFileEarmarkTextFill, BsFillGearFill, BsFillHouseDoorFill, BsFillPersonLinesFill, BsGiftFill, BsGridFill } from "react-icons/bs"
import { config } from '../util/constants';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { useContext, useState, useRef, useEffect } from 'react';
import coin from '../images/coin.png';
import { useMutation, gql } from '@apollo/client';
import guestImage from '../images/guest.png';
import logo from '../images/logo.png';
import '../styles/styles.css'

export default function Navbar() {
    const { user } = useContext(AuthContext);
    let userId = null;

    const cancelRef = useRef()
    const [searchType, setSearchType] = useState('Quizzes')
    const [searchText, setSearchText] = useState("")
    const [choosePlatformName, setChoosePlatformName] = useState(false)
    const [chosenPlatformName, setChosenPlatformName] = useState("Untitled Platform")
    const maxPlatformName = 35

    const bgColor = useColorModeValue("#751616", "purple.900")
    const bgHover = useColorModeValue("red.600", "purple.700")
    const shopColor = useColorModeValue("yellow", "purple")
    const sunIconColor = useColorModeValue("orange", "blue")
    const searchColor = useColorModeValue("yellow.500", "blue.600")
    const searchHover = useColorModeValue("yellow.400", "blue.500")
    const searchbarBg = useColorModeValue("white", "gray.700")

    
    let history = useHistory();
    let logged_in = false
    let categories = ["Quizzes", "Platforms", "Users"]
    let username = "Guest"
    let pfp_src = {guestImage}
    let menu_bg_hover = "blue.500"
    let menu_text_hover = "white"
    let currency = 0;

    const [createPlatform] = useMutation(CREATE_PLATFORM, {
        onCompleted(platform) {
            history.push('/platformpage/' + platform.createPlatform._id);
        },
        onError(err) {
            console.log(err);
        },
    });

    function handleCreatePlatform() {
        setChoosePlatformName(false)
        createPlatform({
            variables: {
                platformInput: {
                    name: chosenPlatformName,
                    iconImage: "https://www.goodcore.co.uk/blog/wp-content/uploads/2019/08/coding-vs-programming-2.jpg",
                    bannerImage: "https://www.goodcore.co.uk/blog/wp-content/uploads/2019/08/what-is-coding.png",
                    background: "white",
                    tags: []
                },
            },
        });
        setChosenPlatformName("Untitled Platform")
    }

    function getPlaceholderText() {
        if (searchType === 'Quizzes') {
            return 'Search for a quiz...'
        } else if (searchType === 'Platforms') {
            return 'Search for a platform...'
        } else {
            return 'Search for a user...'
        }
    }

    // Checks if user is logged in
    if (user !== null && user !== "NoUser"){
        logged_in = true
        username = user.displayName
        currency = user.currency
        pfp_src = user.iconImage
        userId = user._id
    }

    // Allows search to work when 'Enter' key is pressed
    const handleKeyPress = (e) => {
        if (e.charCode === 13) search();
    };

    // Takes user to the search results page
    function search() {
        history.push({
            pathname: `/searchresultspage/${searchType}/${searchText}`
        });
    }

    function goToAccountPage() {
        if (logged_in){
            history.push({
                pathname: '/accountpage/' + user._id,
                state: {
                    // location state
                    search: searchText,
                },
            });
        }

        else {
            history.push({
                pathname: '/loginpage',
                state: {
                    // location state
                    search: searchText,
                },
            });
        }
    }
    

    //If logging out in dark mode, change to light mode. 
    const { colorMode, toggleColorMode } = useColorMode()
    function initialDark(){
        if(colorMode=="dark"){
            toggleColorMode()
        }
    }
    

    return(
        <Box w="100%" h={55} position='sticky' top='0' zIndex='99' bgColor={bgColor} boxShadow="md">
            <Grid h="100%" templateColumns="2fr 3fr 2fr" pos="relative">
                {/* RETURN TO HOMEPAGE */}
                <Box display="flex" flexDirection="column" justifyContent="center">
                    <Image
                        w={230}
                        minW={230}
                        src={logo}
                        className='disable-select'
                        onClick={() => history.push('/')}
                        display='inline-block'
                        _hover={{
                            cursor: 'pointer',
                        }}
                        transition='opacity 0.2s linear'
                        ml='2%'
                    />
                </Box>
                
                {/* SEARCH */}
                <Grid
                    h='50px'
                    pos='relative'
                    top='9%'
                    templateColumns='3fr 12fr 1fr'
                >
                    {/* SEARCH CATEGORIES */}
                    <Select h="45px" value={searchType} onChange={(event) => setSearchType(event.target.value)} borderRadius="5px 0px 0px 5px" bgColor={searchbarBg} _focus={{boxShadow:"none"}} overflow="hidden"> 
                        {categories.map((category, index) => {
                            return <option key={index}> {category} </option>;
                        })}
                    </Select>

                    {/* SEARCH BAR */}
                    <Input h="45px" onKeyPress={handleKeyPress} 
                        onChange={(e) => setSearchText(e.target.value)} 
                        fontSize="17px" 
                        borderRadius="0px" 
                        placeholder={getPlaceholderText()} 
                        bgColor={searchbarBg}
                        _focus={{boxShadow:"none"}}
                    />

                    {/* SEARCH BUTTON */}
                    <Button
                        h='45px'
                        _hover={{ bgColor: searchHover }}
                        borderRadius='0px 5px 5px 0px'
                        bgColor={searchColor}
                        onClick={search}
                        _focus={{boxShadow:"none"}}
                    >
                        <Icon as={SearchIcon} boxSize='6' />
                    </Button>
                </Grid>

                {/* RIGHT SIDE */}
                <HStack >
                    <Box w='5%' />
                    <IconButton icon={<SunIcon/>} colorScheme={sunIconColor} onClick={() => toggleColorMode()} _focus={{outline:"none"}} overflow="hidden" />
                    {/* CATEGORIES */}
                    {/* <Link to='/categorypage'>
                        <Text className="disable-select" fontSize='105%' color='white' fontWeight='medium'>
                            Categories
                        </Text>
                    </Link> */}
                    <Spacer />
                    
                    <div className="fadeshow3">
                    
                    {/* SHOP BUTTON */}
                    <Button 
                        colorScheme={shopColor}
                        leftIcon={<BsFillCartFill />} 
                        onClick={() => history.push( logged_in ? "/shoppingpage" : "/loginpage")} 
                        _focus={{outline:"none"}}
                        borderRadius="40px"
                        overflow="hidden"
                    >
                        Shop 
                    </Button>
                    </div>
                    
                    <Spacer />
                    
                    <div className="fadeshow2">
                    <HStack pr={10} spacing={1} overflow="hidden">
                        <Image src={coin} h="20px" w="20px" minH="20px" minW="20px" position="relative" top="1px"></Image>
                        <Text position="relative" color="white">{currency}</Text>
                    </HStack>
                    </div>

                    {/* USER NAME */}
                    <div className="fadeshow1">
                    <Text className="disable-select" onClick={() => goToAccountPage()} fontSize="100%" color="white" _hover={{cursor:"pointer"}} whiteSpace="nowrap" overflow="hidden"> {username} </Text> 
                    </div>
                    {/* PROFILE PICTURE */}
                    <Avatar src={pfp_src} border="1px solid white" boxSize={10} onClick={() => goToAccountPage()} _hover={{cursor:"pointer"}}/>
                    <Box w='1%' />

                    {/* DROPDOWN MENU */}
                    <Menu>
                        <MenuButton as={IconButton} bgColor={bgColor} _hover={{bgColor:bgHover}} _active={{bgColor:bgHover}} borderRadius="0" icon={<HamburgerIcon boxSize={5} color="white" />} w="45px" h="55px" _focus={{outline:"none"}}/>
                            <MenuList boxShadow='lg'>
                                {/* Create Quiz / Create Platform / Quiz Manager / Platform Manager Buttons */}
                                {logged_in === true ? (
                                    <Box>
                                        <MenuItem icon={<BsFillFileEarmarkTextFill/>} iconSpacing="2" onClick={() => history.push('/createQuiz')} fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> 
                                            Create Quiz   
                                        </MenuItem>
                                        <MenuItem icon={<BsFillHouseDoorFill/>} iconSpacing="2" onClick={() => setChoosePlatformName(true)} fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Create Platform  </MenuItem>
                                        <MenuItem icon={<BsGridFill/>} iconSpacing="2" onClick={() => history.push('/quizmanager')} fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Quiz Manager     </MenuItem>
                                        <MenuItem icon={<BsCollectionFill/>} iconSpacing="2" onClick={() => history.push('/platformmanager/' + user._id)} fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Platform Manager </MenuItem>
                                    </Box>) 
                                    : 
                                    null
                                }
                                
                                {/* Settings Page Button */}
                                <MenuItem icon={<BsFillGearFill />} iconSpacing="2" onClick={() => history.push(user !== "NoUser" ? '/settingspage' : '/loginpage')} fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Settings </MenuItem>
                                
                                {/* Rewards Button / Logout Button */}
                                {logged_in === true ? 
                                    <Box>
                                        {/* <MenuItem icon={<BsGiftFill/>} iconSpacing="2" onClick={() => history.push('/rewardspage')} fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> My Rewards</MenuItem> */}
                                        <a href={`${config.API_URL}/auth/logout`}>
                                            <MenuItem icon={<BsFillPersonLinesFill/>} iconSpacing="2" onClick={() => initialDark()} fontSize="18px" _hover={{bgColor:menu_bg_hover, textColor:"white"}}> Logout </MenuItem>
                                        </a>
                                    </Box>
                                    : 
                                    null
                                }
                            </MenuList>
                    </Menu>
                </HStack>
            </Grid>
            
            {/* Platform Name Input (For Creating Platforms) */}
            <AlertDialog
                isOpen={choosePlatformName}
                leastDestructiveRef={cancelRef}
                onClose={() => setChoosePlatformName(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent top="30%">
                        <AlertDialogHeader color='black' fontSize="lg" fontWeight="bold">
                            Choose A Platform Name
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <Input 
                                maxLength={maxPlatformName}
                                borderColor="gray.300" 
                                value={chosenPlatformName} 
                                onChange={(e) => 
                                    setChosenPlatformName(e.target.value)
                                }/>
                            <Text float="right" fontSize="85%" color={ chosenPlatformName.length === maxPlatformName ? "red.500" : "gray.800" }>  
                                {chosenPlatformName.length}/{maxPlatformName} 
                            </Text>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                        <Button 
                            ref={cancelRef} 
                            onClick={() => {
                                setChoosePlatformName(false)
                                setChosenPlatformName("Untitled Platform")
                            }} 
                            _focus={{border:"none"}}>
                            Cancel
                        </Button>
                        <Button 
                            colorScheme="blue"  
                            ml={3} 
                            bgColor={chosenPlatformName.trim() !== "" ? "" : "gray.400"}
                            _hover={{bgColor: chosenPlatformName.trim() !== "" ? "blue.600" : "gray.400"}}
                            _active={{bgColor: chosenPlatformName.trim() !== "" ? "blue.700" : "gray.400"}}
                            _focus={{border:"none"}}
                            onClick={() => chosenPlatformName.trim() !== "" ? handleCreatePlatform() : null}
                        >
                            Create Platform
                        </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
}

const CREATE_PLATFORM = gql`
    mutation ($platformInput: PlatformInput!) {
        createPlatform(platformInput: $platformInput) {
            name
            _id
        }
    }
`;