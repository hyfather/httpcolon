import { Welcome } from '../components/Welcome/Welcome';
import { useState, useRef } from 'react';

import { AppShell, Navbar, Header, Autocomplete, Loader, Button, Collapse, Table } from '@mantine/core';

import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';

export default function HomePage() {

    const timeoutRef = useRef<number>(-1);
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<string[]>([]);
    const [response, setResponse] = useState<string[]>([]);
    const [opened, setOpened] = useState(false);
    const [rows, setRows] = useState([]);

    const handleChange = (val: string) => {
        window.clearTimeout(timeoutRef.current);
        setValue(val);
        setData([]);

        if (val.trim().length !== 0) {
            fetch(`/api/v1/fetch?url=${encodeURIComponent(val)}`)
                .then(response => response.json())
                .then(data => {
                    setResponse(data);
                    let buffer = [];
                    for (let key in data.resp) {
                        if (data.resp.hasOwnProperty(key)) {
                            const row = <tr>
                                <td>{key}</td>
                                <td>{data.resp[key]}</td>
                            </tr>;
                            buffer.push(row);
                        }
                    }
                    console.log(buffer);
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
                            <th>Header</th>
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
