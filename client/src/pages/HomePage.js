import { React, useContext } from 'react';
import { config } from '../util/constants';
import { AuthContext } from '../context/auth';
import { Box, Heading, Center, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function Homepage() {
    const { user } = useContext(AuthContext);

    if (!user) {
        return null;
    }

    return (
        <div>
            <Center marginTop='30px'>
                {user !== 'NoUser' ? (
                    <div>
                        <Heading marginBottom='20px'>
                            {'Hello, ' + user.displayName}
                        </Heading>
                        <Center>
                            <img
                                style={{ ce: 'center' }}
                                src={user.iconImage}
                            />
                        </Center>
                        <Center>
                            <Heading marginTop='20px'>
                                <a href={`${config.API_URL}/auth/logout`}>
                                    Logout
                                </a>
                            </Heading>
                        </Center>
                    </div>
                ) : (
                    <Heading>
                        <a href={`${config.API_URL}/auth/google`}>
                            Login with Google
                        </a>
                    </Heading>
                )}
            </Center>
            <div>
                <VStack marginTop='50px'>
                    <Link style={{ fontSize: '25px' }} to='/quizzes'>
                        Quizzes with CRUD
                    </Link>
                    <Link style={{ fontSize: '25px' }} to='/quiztakingpage'>
                        Quiz Taking Page
                    </Link>
                    <Link style={{ fontSize: '25px' }} to='/accountpage'>
                        Account Page
                    </Link>
                    <Link style={{ fontSize: '25px' }} to='/postquizpage'>
                        Post Quiz Page
                    </Link>
                    <Link style={{ fontSize: '25px' }} to='/prequizpage'>
                        Pre Quiz Page
                    </Link>
                </VStack>
            </div>
        </div>
    );
}
