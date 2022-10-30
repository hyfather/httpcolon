import { Welcome } from '../components/Welcome/Welcome';
import { useState, useRef, SetStateAction} from 'react';

import {AppShell, Navbar, Header, Autocomplete, Loader, Button, Collapse, Table} from '@mantine/core';

import {ColorSchemeToggle} from '../components/ColorSchemeToggle/ColorSchemeToggle';

export default function HomePage() {

    const timeoutRef = useRef<number>(-1);
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<string[]>([]);
    const [response, setResponse] = useState<string[]>([]);
    const [opened, setOpened] = useState(false);
    const [rows, setRows] = useState<object[]>([]);

    const handleChange = (val: string) => {
        window.clearTimeout(timeoutRef.current);
        setValue(val);
        setData([]);

        if (val.trim().length !== 0) {
            fetch(`/api/v1/fetch?url=${encodeURIComponent(val)}`)
                .then(response => response.json())
                .then(data => {
                    setResponse(data);
                    console.log(data);
                    let buffer: SetStateAction<object[]> = [];
                    let dd = new Map(Object.entries(data.resp));
                    dd.forEach(function(value, key) {
                        // @ts-ignore
                        buffer.push(<tr><td>{key}</td><td>{value}</td></tr>);
                    });
                    setRows(buffer);
                    setLoading(false);
                });
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
                placeholder="https://blog.httpcolon.dev/"
            />
            {!loading &&
                <div>
                    <Table>
                        <thead>
                        <tr>
                            <th>Response Header</th>
                            <th>Value</th>
                        </tr>
                        </thead>
                        <tbody>
                          {rows}
                        </tbody>
                    </Table>
                    {console.log(response)}
                    {console.log(rows)}
                </div>

            }
        </AppShell>
    </>
  );
}
