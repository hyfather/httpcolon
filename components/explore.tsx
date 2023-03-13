import { useEffect, useState } from 'react';
import {Center, Container, Loader, SimpleGrid, Space, Text, Transition} from '@mantine/core';
import { TaskCard } from './taskcard';

function base64Encode(str) {
    const buffer = Buffer.from(str, 'utf-8');
    return buffer.toString('base64');
}

export function Explore() {
    const [exploreItems, setExploreItems] = useState([]);
    const [baseURL, setBaseURL] = useState<string>('');
    const [mounted, setMounted] = useState(false);

    // console.log('explore');
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
            url: 'https://www.github.com',
            method: 'GET',
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
        const fetchData = async () => {
            const results = [];
            for (const item of inventory) {
                const encodedSlug = base64Encode(item.url);
                const slugURL = `${baseURL}/api/v1/colon?slug=${encodedSlug}&method=${item.method}`;

                const response = await fetch(slugURL);
                const data = await response.json();
                const instance = data.instances[data.instances.length - 1];
                // console.log('pushing', data.destination, data.instances[0].method, data.instances[0].latency, data.instances[0].status, data.instances[0].timestamp);
                // @ts-ignore
                results.push(
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

                );
            }
            setExploreItems(results);
        };
        setMounted(true);
        fetchData();
    }, []);

    return (
        <Container>
            {exploreItems.length > 0 ? <Text
                size={28}
                weight="bold"
                variant="gradient"
                gradient={{ from: 'grape', to: 'blue', deg: 100 }}
                sx={{
                    fontFamily: 'Monaco, monospace',
                }}
            >
                ✨EXPLORE
            </Text> : <Center> <Loader color="gray" /> </Center> }
            <Space h="xl" />
            <Container sx={{
                minHeight: '600px'
            }}>
                <SimpleGrid
                  cols={3}
                  spacing="xl"
                  breakpoints={[
                    { maxWidth: 980, cols: 3, spacing: 'md' },
                    { maxWidth: 920, cols: 2, spacing: 'md' },
                    { maxWidth: 600, cols: 1, spacing: 'sm' },
                ]}
                >
                    {exploreItems}
                </SimpleGrid>
            </Container>
        </Container>

    );
}
