import { useEffect, useState } from 'react';
import {Container, SimpleGrid, Space, Text} from '@mantine/core';
import { TaskCard } from './taskcard';


interface ExploreProps {
    refreshTable: Function;
}

function base64Encode(str) {
    const buffer = Buffer.from(str, 'utf-8');
    return buffer.toString('base64');
}

export function Explore({ refreshTable }: ExploreProps) {
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
        if (inventory.length !== exploreItems.length) {
            inventory.forEach((item) => {
                const encodedSlug = base64Encode(item.url);
                const slugURL = `${baseURL}/api/v1/colon?slug=${encodedSlug}&method=${item.method}`;
                console.log('make api call to', item.url);
                fetch(slugURL)
                    .then(response => response.json())
                    .then(data => {
                        console.log(`inv slug fetch: ${data.destination}`);
                        console.log(`inv slug data:${JSON.stringify(data)}`);
                        const cards = exploreItems;
                        console.log("pushing", data.destination, data.instances[0].method, data.instances[0].latency, data.instances[0].status, data.instances[0].timestamp);
                        cards.push(<TaskCard clickable hideRequestParams url={data.destination} method={data.instances[0].method} latency={data.instances[0].latency}  status={data.instances[0].status}  statusMsg={data.instances[0].statusText}  timestamp={data.instances[0].timestamp} copyURL={data.destination} refreshTable={refreshTable} />);
                        setExploreItems(cards);
                        console.log('cards', cards);
                    }).catch((error) => {
                    console.error('Error:', error);
                });
            });
        }
    }, []);

    return (
        <Container>
            <SimpleGrid cols={3} spacing="xl"
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
