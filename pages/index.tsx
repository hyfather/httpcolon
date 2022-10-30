import { Welcome } from '../components/Welcome/Welcome';
import { useState, useRef, SetStateAction} from 'react';

import {AppShell, Navbar, Header, Autocomplete, Loader, Button, Collapse, Table, Grid, NativeSelect} from '@mantine/core';

import {ColorSchemeToggle} from '../components/ColorSchemeToggle/ColorSchemeToggle';

export default function HomePage() {

    const timeoutRef = useRef<number>(-1);
    const [value, setValue] = useState('');
    const [methodValue, setMethodValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<string[]>([]);
    const [response, setResponse] = useState<string[]>([]);
    const [opened, setOpened] = useState(false);
    const [rows, setRows] = useState<object[]>([]);

    function isValidHttpUrl({string}: { string: any }) {
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    }

    const handleChange = (val: string) => {
        window.clearTimeout(timeoutRef.current);
        setValue(val);
        setData([]);

        if (isValidHttpUrl({string: val})) {
            fetch(`/api/v1/fetch?url=${encodeURIComponent(val)}`)
                .then(response => response.json())
                .then(data => {
                    setResponse(data);
                    console.log(data);
                    let buffer: SetStateAction<object[]> = [];
                    let dd = new Map(Object.entries(data.headers));
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

            <Grid>
                <Grid.Col span={"content"}>
                    <NativeSelect
                        data={['GET', 'POST', 'PUT', 'DELETE']}
                        value={methodValue}
                        onChange={handleChange}
                        placeholder="GET"
                    />
                </Grid.Col>

                <Grid.Col span={"auto"}>
                    <Autocomplete
                    value={value}
                    data={data}
                    onChange={handleChange}
                    rightSection={loading ? <Loader size={16} /> : null}
                    placeholder="https://blog.httpcolon.dev/"/>
                </Grid.Col>
            </Grid>


            <Grid>
                <Grid.Col span={4}>Status: {response.status}</Grid.Col>
                <Grid.Col span={4}>Latency: {response.latency} ms</Grid.Col>
                <Grid.Col span={4}>Size: </Grid.Col>
            </Grid>


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

        </AppShell>
    </>
  );
}
