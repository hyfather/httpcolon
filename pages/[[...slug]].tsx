import { Welcome } from '../components/Welcome/Welcome';
import { useState, useRef, SetStateAction, useEffect } from 'react';
import { useRouter } from 'next/router'
import GitHubButton from 'react-github-btn'
import { useForm } from '@mantine/form';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch, IconRefresh, IconTimeline, IconClock } from '@tabler/icons';
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

import {LinksGroup} from 'NavbarLinksGroup';

import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { IconFingerprint, IconCopy, IconMoon, IconSquarePlus, IconSun, IconSwitchHorizontal } from '@tabler/icons';
import { getRandomValues } from 'crypto';
import { DefaultValue } from '@mantine/core/lib/MultiSelect/DefaultValue/DefaultValue';

const BASE_URL = 'https://httpcolon.dev/'
//const BASE_URL = 'http://localhost:3000'


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

        links: {
            marginLeft: -theme.spacing.md,
            marginRight: -theme.spacing.md,
          },
        
          linksInner: {
            paddingTop: theme.spacing.xl,
            paddingBottom: theme.spacing.xl,
          },
        
        

        linkIcon: {
            ref: icon,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
            marginRight: theme.spacing.sm,
        },

        linkActive: {
            '&, &:hover': {
                backgroundColor: theme.fn.variant({ variant: 'light', color: "grape" })
                    .background,
                color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
                [`& .${icon}`]: {
                    color: theme.fn.variant({ variant: 'light', color: "grape" }).color,
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

// const navbarData = [
//     { link: '', label: 'New URL', icon: IconSquarePlus },
//     { link: '', label: 'History', icon: IconFingerprint },
// ];

// export function NavbarSimple(data) {
//     const { classes, cx } = useStyles();
//     const { colorScheme, toggleColorScheme } = useMantineColorScheme();
//     const {instanceData, setInstanceData} = useState(data);

//     const [active, setActive] = useState('Billing');

//     const links = navbarData.map((item) => (
//         <a
//             className={cx(classes.link, { [classes.linkActive]: item.label === active })}
//             href={item.link}
//             key={item.label}
//             onClick={(event) => {
//                 event.preventDefault();
//                 setActive(item.label);
//             }}
//         >
//             <item.icon className={classes.linkIcon} stroke={1.5} />
//             <span>{item.label}</span>
//         </a>
//     ));

//     if(instanceData != null ) {
//         console.log("instanceData");
//         console.log(instanceData);
//         const iLinks = instanceData.map((item) => (
//             <a
//                 className={cx(classes.link, { [classes.linkActive]: item.label === active })}
//                 onClick={(event) => {
//                     event.preventDefault();
//                     setActive(item.label);
//                 }}
//                 >
//                 <item.icon className={classes.linkIcon} stroke={1.5} />
//                 <span>{item.timestamp}</span>
//             </a>       
//         ));
//         setInstanceData(iLinks);
//     };

//     return (
//         <Navbar height={700} width={{ sm: 300 }} p="md">
//             <Navbar.Section grow>
//                 <Group className={classes.header} position="apart">
//                     <Center>
//                         <Image
//                             width={250}
//                             height={80}
//                             src="/httpcolon.png"
//                             fit="contain"
//                         />
//                     </Center>
//                     {/*<Code sx={{ fontWeight: 700 }}>Beta</Code>*/}
//                 </Group>
//                 {links}
//                 {instanceData}
//             </Navbar.Section>

//             <Navbar.Section className={classes.footer}>
//                 <Group position="center" my="xl">
//                     <SegmentedControl
//                         value={colorScheme}
//                         onChange={(value: 'light' | 'dark') => toggleColorScheme(value)}
//                         data={[
//                             {
//                                 value: 'light',
//                                 label: (
//                                     <Center>
//                                         <IconSun size={16} stroke={1.5} />
//                                         <Box ml={10}>Light</Box>
//                                     </Center>
//                                 ),
//                             },
//                             {
//                                 value: 'dark',
//                                 label: (
//                                     <Center>
//                                         <IconMoon size={16} stroke={1.5} />
//                                         <Box ml={10}>Dark</Box>
//                                     </Center>
//                                 ),
//                             },
//                         ]}
//                     />
//                 </Group>
//                 <Center>
//                     {/*<GitHubButton href="https://github.com/hyfather/httpcolon" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" aria-label="Star hyfather/httpcolon on GitHub"></GitHubButton>*/}
//                 </Center>
//             </Navbar.Section>
//         </Navbar>
//     );
// }

export function getFromAPI(slug: string) {
    fetch(BASE_URL + "/api/v1/" + slug)
    .then(response => response.json())
    .then(data => {
        console.log("slug fetch: " + data.destination);
        console.log("slug data:" + JSON.stringify(data));
        return data;
    }).catch((error) => {
        console.error('Error:', error);
    });
}

export default function HomePage(props) {
    const timeoutRef = useRef<number>(-1);
    const [value, setValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [redirect, setRedirect] = useState('');
    const [methodValue, setMethodValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<string[]>([]);
    const [response, setResponse] = useState<string[]>([]);
    const [opened, setOpened] = useState(false);
    const [rows, setRows] = useState<object[]>([]);
    const [copyURL, setCopyURL] = useState<string>(BASE_URL);
    const [slugLoader, setSlugLoader] = useState<number>(0);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const { classes, cx } = useStyles();
    const [active, setActive] = useState('');

    const router = useRouter()

    const slug = router.query["slug"];

    if (slug != null && slugLoader == 0) {
        fetch(BASE_URL + "/api/v1/" + slug)
            .then(response => response.json())
            .then(data => {
                console.log("slug fetch: " + data.destination);
                console.log("slug data:" + JSON.stringify(data));
                setData(data);
                setValue(data.destination);
                setInputValue(data.destination);
                setResponse(data.instances[0]);
                setSlugLoader(1)
            }).catch((error) => {
                console.error('Error:', error);
            });
    }

    function refreshTable() {
        console.log("refreshing table");
        fetch(BASE_URL + "/api/v1/" + slug + "?refresh=true")
        .then(response => response.json())
        .then(data => {
            console.log("slug fetch: " + data.destination);
            console.log("slug data:" + JSON.stringify(data));
            setData(data);
            setValue(data.destination);
            setInputValue(data.destination);
            setResponse(data.instances[data.instances.length - 1]);
            console.log("refreshed table" + data);
            setSlugLoader(1)
        }).catch((error) => {
            console.error('Error:', error);
        });
    };

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


    useEffect(() => {
        if (redirect !== "") {
            const r = redirect;
            setRedirect("");
            if (window.location.href !== r) {
                window.location.href = r;
            }
        }
    });

    var iLinks = [];
    if(data != null && data.instances != null) {
        const instances = data.instances;
        // setActive(instances[0].timestamp);
        console.log("data.instances: " + instances);
        var d = new Date(0);
        iLinks = instances.map(function(item) {
            d = new Date(item.timestamp);
            return <a
            className={cx(classes.link, { [classes.linkActive]: item.timestamp === active })}
            key={item.timestamp}
            onClick={(event) => {
                    event.preventDefault();
                    // console.log("click me" + item);
                    setResponse(item);
                    setActive(item.timestamp);
                }}
                >
                <span> <IconClock size={16} stroke={1} /> <Code> {d.toLocaleString()} </Code></span>
            </a>       
        });
    }

//     <CopyButton value={copyURL}>
//     {({ copied, copy }) => (
//         <Button variant="outline" size="xs" leftIcon={<IconCopy />} color={copied ? 'blue' : 'black'} onClick={copy}>
//             {copied ? 'URL Copied' : copyURL}
//         </Button>
//     )}
// </CopyButton></Header> 

    function handleTextInputChange(event) {
        event.preventDefault();
        if(event.target.value != null) {
            setInputValue(event.target.value);
        }
    }

    // @ts-ignore
    return (
        <>
            <AppShell
                padding="lg"
                navbar={
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
                        {/* {instanceData} */}
                        {iLinks}
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
                            <GitHubButton href="https://github.com/hyfather/httpcolon" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" aria-label="Star hyfather/httpcolon on GitHub"></GitHubButton>
                        </Center>
                    </Navbar.Section>
                </Navbar>
                }
                header={<Header height={80} p="xs">
                            <form onSubmit={form.onSubmit(function (values) {
                                console.log("redirecting", inputValue);
                                const strippedUrl = inputValue.replace(/(^\w+:|^)\/\//, '').split('?')[0];
                                const redirectUrl = values.method === "GET" || values.method == "" ? (BASE_URL + '/' + strippedUrl) : (BASE_URL + '/' + strippedUrl + "?method=" + values.method);
                                console.log("redirectUrl: " + redirectUrl + values.method);
                                setCopyURL(redirectUrl);
                                setRedirect(redirectUrl);
                            })}>
                                <Grid>
                                    <Grid.Col span={2}>
                                        <Select mt="xs" placeholder="GET" {...form.getInputProps('method')} data={['GET', 'POST', 'PUT', 'DELETE']} />
                                    </Grid.Col>
                                    <Grid.Col span={"auto"}>
                                        <TextInput mt="xs" {...form.getInputProps('url')} value={inputValue} onChange={handleTextInputChange} />
                                    </Grid.Col>
                                    <Grid.Col span={1}>
                                        <Button type="submit" mt="xs" variant="gradient" gradient={{ from: 'pink', to: 'grape' }}>
                                            Colonize
                                        </Button>
                                    </Grid.Col>
                                </Grid>
                            </form>
                        </Header>}
                styles={(theme) => ({
                    main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
                })}
            >

                <Container>
                         <Button variant="light" color="grape" size="xs" onClick={refreshTable}>
                            <IconRefresh size={16} stroke={1.5} />
                        </Button>

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
                                            Timestamp {new Date(response.timestamp).toLocaleString()}
                                        </Code>
                                    </div>
                                    <div>
                                    </div>


                                </div>
                            </div>
                        </Card>

                        <div>
                            <TableSort data={response.payload} />
                        </div>

                </Container>

            </AppShell>
        </>
    );
}
