import { Welcome } from '../components/Welcome/Welcome';
import { useState, useRef } from 'react';

import { AppShell, Navbar, Header, Autocomplete, Loader } from '@mantine/core';

import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';

export default function HomePage() {

    const timeoutRef = useRef<number>(-1);
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<string[]>([]);

    const handleChange = (val: string) => {
        window.clearTimeout(timeoutRef.current);
        setValue(val);
        setData([]);

        if (val.trim().length !== 0) {
            fetch(val)
                .then(response => response.json())
                .then(data => setData(data));
            setLoading(false);
        } else {
            setLoading(true);
        }
    };


  return (
    <>
        <AppShell
            padding="md"
            navbar={<Navbar width={{ base: 300 }} height={500} p="xs">Http Colon</Navbar>}
            header={<Header height={60} p="xs">HTTP Colon</Header>}
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            <ColorSchemeToggle />
            <Autocomplete
                value={value}
                data={data}
                onChange={handleChange}
                rightSection={loading ? <Loader size={16} /> : null}
                label="URL"
                placeholder="https://www.google.com/"
            />
            <div>
                hi
                {data}
            </div>
        </AppShell>
    </>
  );
}
