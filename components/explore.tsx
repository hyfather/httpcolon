import { useEffect, useState } from 'react';
import { Container, SimpleGrid, Space, Text } from '@mantine/core';
import { TaskCard } from './taskcard';
import {motion} from "framer-motion";


function base64Encode(str) {
    const buffer = Buffer.from(str, 'utf-8');
    return buffer.toString('base64');
}

export function Explore() {
    const [exploreItems, setExploreItems] = useState([]);
    const [baseURL, setBaseURL] = useState<string>('');

    console.log('explore');
    const inventory = [
        {
            url: 'https://www.google.com',
            method: 'GET' },
        {
            url: 'https://www.facebook.com',
            method: 'GET' },
        {
            url: 'https://www.twitter.com',
            method: 'GET',
        },
        {
            url: 'https://www.instagram.com',
            method: 'POST',
        },
        {
            url: 'https://www.cloudflare.com',
            method: 'GET',
        },
        {
            url: 'https://www.substack.com',
            method: 'GET',
        },
        {
            url: 'https://www.wikipedia.com',
            method: 'GET',
        },
        {
            url: 'https://news.ycombinator.com',
            method: 'GET',
        },
        {
            url: 'https://www.amazon.com',
            method: 'GET',
        },
    ];

    useEffect(() => {
        setBaseURL(window.location.origin);
        if (exploreItems.length === 0) {
            console.log('generating exploreItems inventory', exploreItems);
            inventory.forEach((item) => {
                const encodedSlug = base64Encode(item.url);
                const slugURL = `${baseURL}/api/v1/colon?slug=${encodedSlug}&method=${item.method}`;
                console.log('make api call to', item.url);
                fetch(slugURL)
                    .then(response => response.json())
                    .then(data => {
                        const cards = exploreItems;
                        const instance = data.instances[0];
                        console.log('pushing', data.destination, data.instances[0].method, data.instances[0].latency, data.instances[0].status, data.instances[0].timestamp);
                        // @ts-ignore
                        cards.push(
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                            >
                            <TaskCard
                              clickable
                              hideRequestParams
                              url={data.destination}
                              method={instance.method}
                              latency={instance.latency}
                              status={instance.status}
                              statusMsg={instance.statusText}
                              timestamp={instance.timestamp}
                              copyURL={data.destination}
                            />
                            </motion.div>
                        );
                        setExploreItems(cards);
                        console.log('cards', cards);
                    }).catch((error) => {
                    console.error('Error:', error);
                });
            });
        } else {
            console.log('exploreItems already generated', exploreItems);
        }
    }, []);

    return (
        <Container>
            <SimpleGrid
              cols={3}
              spacing="xl"
              breakpoints={[
                { maxWidth: 980, cols: 3, spacing: 'md' },
                { maxWidth: 755, cols: 2, spacing: 'sm' },
                { maxWidth: 600, cols: 1, spacing: 'sm' },
            ]}
            >
                {exploreItems}
            </SimpleGrid>
        </Container>
    );
}
