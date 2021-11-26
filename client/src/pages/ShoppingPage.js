import { Box, Grid, Text, Image, Center, Button, HStack, Icon } from '@chakra-ui/react';
import ShopItemCard from '../components/ShoppingPage/ShopItemCard'
import treeshop from '../images/treeshop.png'
import { AuthContext } from '../context/auth';
import React, { useState, useContext} from 'react';
import '../styles/ShoppingPage.css';
import { bannerEffects, iconEffects, backgrounds, weeklySpecials } from '../components/ShoppingPage/itemData'


import { useQuery } from '@apollo/client';
import {  GET_USER } from '../cache/queries';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { BsBookmarkStarFill, BsImageFill, BsPersonCircle, BsStars } from 'react-icons/bs';

export default function ShoppingPage() {
    const { user } = useContext(AuthContext);
    const [page, setPage] = useState('bannerEffects');
    const [pageNum, setPageNum] = useState(0);

    const numBannerPages = Math.ceil(bannerEffects.items.length/4)
    const numIconPages = Math.ceil(iconEffects.items.length/4)
    const numBackgroundPages = Math.ceil(backgrounds.items.length/4)
    const numSpecialPages = Math.ceil(weeklySpecials.items.length/4)

    // Maps out information needed for the header sections at the top
    const headerSections = [
        {
            pageName: "Banner Effects",
            pageId: 'bannerEffects',
            icon: BsStars,
        },
        {
            pageName: "Icon Effects",
            pageId: 'iconEffects',
            icon: BsPersonCircle,
        },
        {
            pageName: "Backgrounds",
            pageId: 'backgrounds',
            icon: BsImageFill,
        },
        {
            pageName: "Weekly Specials",
            pageId: 'weeklySpecials',
            icon: BsBookmarkStarFill,
        }
    ]

    let coins = (user === null ? null : user.currency)
    // const {
    //     loading,
    //     error,
    //     data: { getUser: userData } = {},
    // } = useQuery(GET_USER, {
    //     skip: !user,
    //     fetchPolicy: 'cache-and-network',
    //     onError(err) {
    //         console.log(JSON.stringify(err, null, 2));
    //     },
    //     onCompleted({ getUser: userData }) {
    //         username = userData.displayName;
    //     },
    // });
    
    function totalPageCount(){
        if (page === 'bannerEffects') return numBannerPages;
        if (page === 'iconEffects') return numIconPages;
        if (page === 'backgrounds') return numBackgroundPages;
        if (page === 'weeklySpecials') return numSpecialPages;
    }

    // Renders the appropriate items for the selected category
    function renderPage() {
        if (page === 'bannerEffects') return itemStocker(pageNum, bannerEffects)
        if (page === 'iconEffects') return itemStocker(pageNum, iconEffects) 
        if (page === 'backgrounds') return itemStocker(pageNum, backgrounds)
        if (page === 'weeklySpecials') return itemStocker(pageNum, weeklySpecials) 
    }

    // Renders the page buttons at the bottom of the screen
    function pageButtons(current, total){
        let list = []
        for (let i = 0; i < total; i++) {
            if (current === i) {
                list.push(
                <Button 
                    bgColor="gray.500"
                    _hover={{bgColor:"gray.600"}} 
                    _active={{bgColor:"gray.700"}} 
                    _focus={{border:"none"}}
                    borderRadius="50%"
                    onClick={() => goToPage(i)}
                    color="white"
                >
                    {i+1}
                </Button>
                )}
            else{
                list.push(
                    <Button 
                        bgColor="gray.300"
                        _hover={{bgColor:"gray.400"}} 
                        _active={{bgColor:"gray.500"}} 
                        _focus={{border:"none"}}
                        borderRadius="50%"
                        onClick={() => { goToPage(i)}}
                    >
                    {i+1}
                    </Button>
                )
            }
        }
        return list            
    }

    // Displays the shop items based on which category they're currently viewing (Banner effects, Icon effects, Backgrounds, Weekly Specials)
    function itemStocker(pageIndex, itemType) {
        // Denote the items that should be shown in the shop (4 at a time)
        let startIndex = pageIndex * 4
        let endIndex = startIndex + 4
        
        let numItemsShowing = 0
        return (
            <Box>
                <Grid ml="4%" mr="4%" templateColumns="1fr 1fr" alignItems="center" justifyContent="center">
                    {itemType.items.slice(startIndex, endIndex).map((item, key) => {
                        numItemsShowing++

                        return (
                            <Center>
                                <ShopItemCard itemType={itemType.type} item={item} key={key}/>
                            </Center>
                        )
                    })}
                    
                    {addPadding(numItemsShowing)}   
                </Grid>
            </Box>
        )
    }
    
    // Adds padding to the bottom of the items (Otherwise, page number would get pushed upwards which we don't want)
    function addPadding(numItemsShowing) {
        if (numItemsShowing < 3) {
            let padArr = [0, 0]
            return padArr.map(() => 
                <Box> 
                    <Box h="20vh" />
                    <Box h={59} /> 
                </Box>
            )
        }
    }
    
    // Jumps to a page (Page numbers at the bottom)
    function goToPage(pageNum) {
        setPageNum(pageNum)
    }

    return (
        <Box>
            {/*Shop Banner*/}
            <Center>
                <Image pt={5} src={treeshop} alt={"Tree Shop Banner"} />
            </Center>

            {/* Navigate between categories (Header Buttons) */}
            <Grid w='100%' h='6vh' minH='50px' templateColumns='repeat(4, 1fr)'>
                {headerSections.map((headerSection, key) => {
                    return (
                        <Box className="disable-select" key={key} display="flex" flexDir="column" justifyContent="center">
                            <Text
                                w='100%'
                                fontSize='125%'
                                textColor={page === headerSection.pageId ? 'blue.500' : 'gray.700'}
                                textAlign="center"
                                transition=".1s linear"
                                whiteSpace="nowrap"
                                _focus={{ boxShadow:'none' }}
                                _hover={{ cursor:'pointer', opacity:"70%", transition:".15s linear" }}
                                onClick={() => {
                                    setPage(headerSection.pageId)
                                    goToPage(0)
                                }}
                            >
                                <Icon as={headerSection.icon} pos="relative" top={-0.5}  mr={2} />
                                {headerSection.pageName}
                            </Text>
                            {/* <Box h="4px" mt="3%" bgColor={page === headerSection.pageId  ? "blue.500" : "gray.400" }  transition="0.15s linear"/> */}
                        </Box>
                    )
                } )}
            </Grid>

            <Center>
                <Box w="90%" h="0.75px" bgColor="gray.300" />    
            </Center>

            {/* Main Body */}
            <Box>
                <Grid templateColumns="1fr 15fr 1fr">
                    {/* Left Arrow */}
                    {
                        pageNum === 0 ? 
                            <Box />
                            :
                            <Box onClick={() => setPageNum(pageNum - 1)} transition=".15s linear" _hover={{cursor:"pointer", bgColor:"gray.100", transition:".15s linear"}}
                                display="flex" flexDir="column" justifyContent="center"> 
                                <Center>
                                    <Icon as={ChevronLeftIcon} boxSize={16}/>
                                </Center>
                            </Box>
                    }
                    
                    {/* Shop Items */}
                    {renderPage()}

                    {/* Right Arrow */}
                    {
                        pageNum === totalPageCount() - 1 ? 
                            <Box />
                            :
                            <Box onClick={() => setPageNum(pageNum + 1) }  transition=".15s linear" _hover={{cursor:"pointer", bgColor:"gray.100", transition:".15s linear"}}
                                display="flex" flexDir="column" justifyContent="center"> 
                                <Center>
                                    <Icon as={ChevronRightIcon} boxSize={16} />
                                </Center>
                            </Box>
                    }
                </Grid>

                {/* Page Buttons */}
                <Center>
                    <HStack mt={5}>
                        {pageButtons(pageNum, totalPageCount())}
                    </HStack>
                </Center>
            </Box>
        </Box>
    )
}