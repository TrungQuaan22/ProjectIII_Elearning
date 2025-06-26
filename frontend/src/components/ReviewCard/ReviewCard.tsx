import React from 'react';
import {  Box, Grid, Text } from '@chakra-ui/react';
import { Rating } from '../ui/rating';
import { Avatar } from '../ui/avatar';
import styles from './ReviewCard.module.scss';
import { Review } from 'src/types/review.type';
function ReviewCard({ item }: { item: Review }) {
    return (
        <div className={styles['wrapper']}>
            <Grid
                className={styles['box-comment']}
                templateColumns="auto 1fr"
                gap={4}
                alignItems="center"
            >
                <Box>
                    <Avatar
                        className={styles['avatar']}
                        name={item.id.toString()}
                        src=""
                    >
                        {item.id}
                    </Avatar>
                </Box>
                <Box className={styles['content']}>
                    <Box className={styles['info']} mb={2}>
                        <Text className={styles['name']} fontWeight="bold">
                            {`Người dùng ${item.id}`}
                        </Text>
                        {/* Uncomment this line if needed */}
                        {/* <Text opacity={0.7}>{item.time}</Text> */}
                    </Box>
                    <Box>
                        <Rating
                            value={item.rating || 5}
                            name="half-rating"
                            defaultValue={2.5}
                            readOnly
                        />
                    </Box>
                    <Text mt={2} className={styles['comment']}>
                        {item.content}
                    </Text>
                </Box>
            </Grid>
        </div>
    );
}

export default ReviewCard;
