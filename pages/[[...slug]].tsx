import { Welcome } from '../components/Welcome/Welcome';
import { useState, useRef, SetStateAction, useEffect } from 'react';
import { useRouter } from 'next/router'
import GitHubButton from 'react-github-btn'
import { useForm } from '@mantine/form';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch, IconRefresh } from '@tabler/icons';
import { TableSort } from './tablesort';


import {
    AppShell,
    Navbar,
    Header,
    Code,
    Button,
    Card,
    Table,
    TextInput,
    Stack,
    CopyButton,
    Group,
    Grid,
    Text,
    ScrollArea,
    Box,
    createStyles, SegmentedControl,
    Center,
    UnstyledButton,
    useMantineColorScheme,
    Image,
    Select,
    Container,
    Footer,
    keyframes,
} from '@mantine/core';

import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { IconFingerprint, IconCopy, IconMoon, IconSquarePlus, IconSun, IconSwitchHorizontal } from '@tabler/icons';
import { getRandomValues } from 'crypto';


const useStyles = createStyles((theme, _params, getRef) => {
    const icon = getRef('icon');
    return {
        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5,
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                }`,
        },

        footer: {
            paddingTop: theme.spacing.md,
            marginTop: theme.spacing.md,
            borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
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

        card: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        },

        label: {
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
            lineHeight: 1,
        },

        lead: {
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
            fontSize: 22,
            lineHeight: 1,
        },

        inner: {
            display: 'flex',

            [theme.fn.smallerThan(350)]: {
                flexDirection: 'column',
            },
        },

        ring: {
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',

            [theme.fn.smallerThan(350)]: {
                justifyContent: 'center',
                marginTop: theme.spacing.md,
            },
        },

        th: {
            padding: '0 !important',
        },

        control: {
            width: '100%',
            padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

            '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            },
        },

        icon: {
            width: 21,
            height: 21,
            borderRadius: 21,
        },


    };
});

const data = [
    { link: '', label: 'New URL', icon: IconSquarePlus },
    { link: '', label: 'History', icon: IconFingerprint },
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
                    <Center>
                        <Image
                            width={250}
                            height={80}
                            src="/httpcolon.png"
                            fit="contain"
                        />
                    </Center>
                    {/*<Code sx={{ fontWeight: 700 }}>Beta</Code>*/}
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
                <Center>
                    {/*<GitHubButton href="https://github.com/hyfather/httpcolon" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" aria-label="Star hyfather/httpcolon on GitHub"></GitHubButton>*/}
                </Center>
            </Navbar.Section>
        </Navbar>
    );
}


export default function HomePage(props) {
    //    const baseURL = 'https://httpcolon.dev/'
    const baseURL = 'http://localhost:3000/'
    const timeoutRef = useRef<number>(-1);
    const [value, setValue] = useState('');
    const [redirect, setRedirect] = useState('');
    const [methodValue, setMethodValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<string[]>([]);
    const [response, setResponse] = useState<string[]>([]);
    const [opened, setOpened] = useState(false);
    const [rows, setRows] = useState<object[]>([]);
    const [copyURL, setCopyURL] = useState<string>(baseURL);
    const [slugLoader, setSlugLoader] = useState<number>(0);

    const router = useRouter()
    const slug = router.query["slug"];

    if (slug !== "" && slugLoader == 0) {
        fetch(baseURL + "/api/v1/" + slug)
            .then(response => response.json())
            .then(data => {
                console.log("slug fetch: " + data.destination);
                console.log("slug data:" + JSON.stringify(data));
                setValue(data.destination);
                setResponse(data);
                let buffer: SetStateAction<object[]> = [];
                let dd = new Map(Object.entries(data.payload));
                dd.forEach(function (value, key) {
                    // @ts-ignore
                    // buffer.push(<tr key={key}><td>{key}</td><td>{value}</td></tr>);
                    buffer.push({ "header": key, "value": value })
                });
                // setCopyURL(window.location.href);
                // window.history.pushState(data.id, data.destination);
                setRows(buffer);
                setSlugLoader(1)
            })
    }

    function isValidHttpUrl({ string }: { string: any }) {
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


    const form = useForm({
        initialValues: { url: '', method: '' },
    });

    const { classes, theme } = useStyles();

    useEffect(() => {
        if (redirect !== "") {
            const r = redirect;
            setRedirect("");
            if (window.location.href !== r) {
                window.location.href = r;
            }
        }
    });


    // @ts-ignore
    return (
        <>
            <AppShell
                padding="lg"
                navbar={NavbarSimple()}
                header={<Header height={60} p="xs">
                    <CopyButton value={copyURL}>
                        {({ copied, copy }) => (
                            <Button variant="outline" size="xs" leftIcon={<IconCopy />} color={copied ? 'blue' : 'black'} onClick={copy}>
                                {copied ? 'URL Copied' : copyURL}
                            </Button>
                        )}
                    </CopyButton></Header>
                }
                styles={(theme) => ({
                    main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
                })}
            >

                <Container>
                    <Stack>
                        <form onSubmit={form.onSubmit(function (values) {
                            console.log("redirecting");
                            const strippedUrl = values.url.replace(/(^\w+:|^)\/\//, '').split('?')[0];
                            const redirectUrl = values.method === "GET" || values.method == "" ? (baseURL + '/' + strippedUrl) : (baseURL + '/' + strippedUrl + "?method=" + values.method);
                            console.log("redirectUrl: " + redirectUrl + values.method);
                            setCopyURL(redirectUrl);
                            setRedirect(redirectUrl);
                        })}>
                            <Grid>
                                <Grid.Col span={2}>
                                    <Select mt="sm" placeholder="GET" {...form.getInputProps('method')} data={['GET', 'POST', 'PUT', 'DELETE']} />
                                </Grid.Col>
                                <Grid.Col span={"auto"}>
                                    <TextInput mt="sm" {...form.getInputProps('url')}/>
                                </Grid.Col>
                                <Grid.Col span={1}>
                                    <Button type="submit" mt="sm">
                                        Colonize
                                    </Button>
                                </Grid.Col>
                            </Grid>


                        </form>

                        <Card withBorder p="xl" radius="md" className={classes.card}>
                            <div className={classes.inner}>
                                <div>
                                    <Code color="teal">
                                        GET {response.destination}
                                    </Code>
                                    <div>
                                        <Code>
                                        Status {response.status}
                                        </Code>
                                    </div>
                                    <div>
                                        
                                        <Code>
                                        Latency {response.latency} ms
                                        </Code>
                                    </div>
                                    <div>     
                                        <Code>
                                            Timestamp {response.timestamp}
                                        </Code>
                                    </div>
                                    <div>
                                        <Button leftIcon={<IconRefresh />} variant="outline" size="xs">
                                            Refresh
                                        </Button>
                                    </div>


                                </div>
                            </div>
                        </Card>

                        <div>
                            <TableSort data={response.payload} />
                        </div>

                    </Stack>
                </Container>

            </AppShell>
        </>
    );
}
