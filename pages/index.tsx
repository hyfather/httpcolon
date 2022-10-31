import { Welcome } from '../components/Welcome/Welcome';
import { useState, useRef, SetStateAction} from 'react';

import {
    AppShell,
    Navbar,
    Header,
    Autocomplete,
    Loader,
    Button,
    Collapse,
    Table,
    Grid,
    NativeSelect,
    CopyButton,
    Group,
    Code,
    Text,
    Box,
    createStyles, SegmentedControl,
    Center,
    useMantineColorScheme,
} from '@mantine/core';

import {ColorSchemeToggle} from '../components/ColorSchemeToggle/ColorSchemeToggle';
import {IconFingerprint, IconLogout, IconMoon, IconSettings, IconSun, IconSwitchHorizontal} from '@tabler/icons';


const useStyles = createStyles((theme, _params, getRef) => {
    const icon = getRef('icon');
    return {
        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5,
            borderBottom: `1px solid ${
                theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
            }`,
        },

        footer: {
            paddingTop: theme.spacing.md,
            marginTop: theme.spacing.md,
            borderTop: `1px solid ${
                theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
            }`,
        },

        link: {
            ...theme.fn.focusStyles(),
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            fontSize: theme.fontSizes.sm,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
            borderRadius: theme.radius.sm,
            fontWeight: 500,

            '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,

                [`& .${icon}`]: {
                    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
                },
            },
        },

        linkIcon: {
            ref: icon,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
            marginRight: theme.spacing.sm,
        },

        linkActive: {
            '&, &:hover': {
                backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
                    .background,
                color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
                [`& .${icon}`]: {
                    color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
                },
            },
        },
    };
});

const data = [
    { link: '', label: 'History', icon: IconFingerprint },
    { link: '', label: 'Settings', icon: IconSettings },
];

export function NavbarSimple() {
    const { classes, cx } = useStyles();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const [active, setActive] = useState('Billing');

    const links = data.map((item) => (
        <a
            className={cx(classes.link, { [classes.linkActive]: item.label === active })}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ));

    return (
        <Navbar height={700} width={{ sm: 300 }} p="md">
            <Navbar.Section grow>
                <Group className={classes.header} position="apart">
                    <Text>HTTP COLON</Text>
                    <Code sx={{ fontWeight: 700 }}>Beta</Code>
                </Group>
                {links}
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                <Group position="center" my="xl">
                    <SegmentedControl
                        value={colorScheme}
                        onChange={(value: 'light' | 'dark') => toggleColorScheme(value)}
                        data={[
                            {
                                value: 'light',
                                label: (
                                    <Center>
                                        <IconSun size={16} stroke={1.5} />
                                        <Box ml={10}>Light</Box>
                                    </Center>
                                ),
                            },
                            {
                                value: 'dark',
                                label: (
                                    <Center>
                                        <IconMoon size={16} stroke={1.5} />
                                        <Box ml={10}>Dark</Box>
                                    </Center>
                                ),
                            },
                        ]}
                    />
                </Group>
            </Navbar.Section>
        </Navbar>
    );
}



export default function HomePage() {

    const baseURL = 'https://httpcolon.dev/'
    const timeoutRef = useRef<number>(-1);
    const [value, setValue] = useState('');
    const [methodValue, setMethodValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<string[]>([]);
    const [response, setResponse] = useState<string[]>([]);
    const [opened, setOpened] = useState(false);
    const [rows, setRows] = useState<object[]>([]);
    const [copyURL, setCopyURL] = useState<string>(baseURL);

    function isValidHttpUrl({string}: { string: any }) {
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    }

    const handleMethodChange = (val: string) => {
        window.clearTimeout(timeoutRef.current);
        setMethodValue(val);
    };

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
                    buffer.push(<tr key={key}><td>{key}</td><td>{value}</td></tr>);
                });
                setCopyURL( baseURL + data.id);
                window.history.pushState(data.id, val, '/' + data.id);
                setRows(buffer);
                setLoading(false);
            });
    } else {
        setLoading(true);
    }
    };

    // @ts-ignore
    return (
    <>
        <AppShell
            padding="lg"
            navbar={NavbarSimple()}
            header={<Header height={60} p="xs">
            <CopyButton value={copyURL}>
                {({ copied, copy }) => (
                    <Button variant="subtle" color={copied ? 'blue' : 'black'} onClick={copy}>
                        {copied ? 'URL Copied' : copyURL}
                    </Button>
                )}
            </CopyButton></Header>
            }
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >

            <Grid>
                <Grid.Col span={"content"}>
                    <NativeSelect
                        data={['GET', 'POST', 'PUT', 'DELETE']}
                        value={methodValue}
                        placeholder="GET"
                        onChange={handleMethodChange}
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

            <Table>
                <tbody>
                    <tr>
                        <td>Status</td>
                        <td>{response.status}</td>
                    </tr>
                    <tr>
                        <td>Latency</td>
                        <td>{response.latency}ms</td>
                    </tr>
                    <tr>
                        <td>Size</td>
                        <td>KB</td>
                    </tr>
                </tbody>
            </Table>

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
