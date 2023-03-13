import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import {
    createStyles,
    ScrollArea,
    Group,
    Text,
    Center,
    Space, Container, Divider, ActionIcon, Title, Badge, Select, Box, Stack,
} from '@mantine/core';
import {
    IconArrowBigTop, IconLink,
    IconPin, IconSearch,
} from '@tabler/icons';

const useStyles = createStyles((theme) => ({
    inactiveHeader: {
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        },
    },

    activeHeader: {
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        backgroundImage: theme.colorScheme === 'dark' ? theme.fn.gradient({ from: theme.colors.gray[8], to: theme.colors.gray[9], deg: 200 }) : theme.fn.gradient({ from: theme.colors.gray[1], to: theme.colors.gray[2], deg: 225 }),
        h1: {
            color: theme.colorScheme === 'dark' ? theme.colors.blue[1] : theme.colors.blue[8],
        },
    },

    inactiveDirective: {
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        border: '1px solid transparent',
        button: {
            visibility: 'hidden',
        },

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1],
            button: {
                visibility: 'visible',
            },
        },
    },

    activeDirective: {
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        border: `1px solid ${theme.colors.blue[8]}`,
        borderRadius: 5,
        backgroundImage: theme.colorScheme === 'dark' ? theme.fn.gradient({ from: theme.colors.gray[9], to: theme.colors.gray[8], deg: 200 }) : theme.fn.gradient({ from: theme.colors.gray[1], to: theme.colors.gray[3], deg: 45 }),
        // backgroundImage: theme.colorScheme === 'dark' ? theme.fn.gradient({ from: theme.colors.grape[8], to: theme.colors.blue[8], deg: 20 }) : theme.fn.gradient({ from: theme.colors.blue[2], to: theme.colors.blue[1], deg: 225 }),
        '.badge': {
            color: theme.colorScheme === 'dark' ? theme.colors.blue[1] : theme.colors.blue[8],
        },
    },
}));

interface HeaderData {
    header: string;
    description: string;
    responseDirectives: ResponseDirective[];
}

interface ResponseDirective {
    directive: string,
    description: string,
    details: string
}

interface FullDocsProps {
    focus: string;

    setFocus: Function;

    embedded: boolean;
    updateTable: string;
}

export function FullDocs({ focus, setFocus, embedded, updateTable }: FullDocsProps) {
    const [rows, setRows] = useState([]);
    const { classes, theme } = useStyles();
    const [lastFocus, setLastFocus] = useState('');
    const refs = useRef({});
    const viewport = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [searchValue, onSearchChange] = useState('');
    const [headerData, setHeaderData] = useState([]);

    const makeRows = () => {
        if (headerData == null) {
            setRows([]);
            return;
        }
        const rowsBody = headerData.map((header) => {
            const responseDirectives = header['response-directives'];
            return <Box
                ref={(el) => (refs.current[header.header.toLowerCase()] = el)}
                className={classes.inactiveHeader}
                key={header.header}
            > <div
              key={header.header}
            >
                <Group position="right" mt="md" mb="sm">
                </Group>
                <div
                  key={header.header}
                  onClick={(e) => {
                        e.preventDefault();
                        setFocus(`${header.header}$`);
                    }}
                  sx={{
                      button: {
                          visibility: 'hidden',
                      },
                      '&:hover': {
                          button: {
                              visibility: 'visible',
                          },
                      },
                  }}
                >

                        <Group spacing="xs">
                        <Title size={24}> {header.header} </Title>
                            <ActionIcon variant="outline"
                                        color="blue"
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setFocus(`${header.header}$`);
                                            router.push(`#${header.header}`, `#${header.header}`, { shallow: false, scroll: false });
                                        }}
                                        >
                                <IconLink size={16} />
                            </ActionIcon>
                        </Group>
                    <Space h="xs" />
                </div>

                <Text size="sm"> {header.description} </Text>
                <Space h="sm" />
              </div>
            {responseDirectives.length > 0 ?
                <div>
                <Title size="sm" gradient={{ from: theme.colors.gray[5], to: theme.colors.gray[9] }}> Response Directives </Title>
                    <Space h="xs" />
                <div>
                    {responseDirectives.map((directive) => {
                        if (directive == null || directive.directive == null) {
                            return <div />;
                        }
                        const directiveKey = [header.header.toLowerCase(), directive.directive.toLowerCase()].join('$');
                        return <div
                           key={directiveKey}
                           // id={directiveKey}
                           ref={(el) => (refs.current[directiveKey] = el)}
                           className={classes.inactiveDirective}
                         >
                            <Group spacing="xs">
                                <Badge
                                    color="gray"
                                    variant="outline"
                                    radius="sm"
                                    class="badge"
                                >{directive.directive}</Badge>
                                <ActionIcon variant="outline" color="blue" size="xs" onClick={(e) => {
                                    e.preventDefault();
                                    if (directiveKey) {
                                        setFocus(directiveKey);
                                        router.push(`#${directiveKey}`, `#${directiveKey}`, { shallow: false, scroll: false });
                                    }
                                }}>
                                    <IconLink size={14} />
                                </ActionIcon>
                            </Group>

                            <Space h="xs" />
                            <Text size="xs"> {directive.description} </Text>
                            <Text size="xs"> {directive.details} </Text>
                                </div>;
                        }
                    )}
                </div>
                </div>
            : ''}
            <Divider size="xs" />
            <Group position="right" mt="md" mb="sm" spacing="xs">
                <ActionIcon
                  variant="filled"
                  size="xs"
                  onClick={(e) => {
                      e.preventDefault();
                      setFocus(`${header.header.toLowerCase()}$`);
                }}
                >
                    <IconPin size={10} />
                </ActionIcon>
                <ActionIcon
                    variant="filled"
                    size="xs"
                    onClick={(e) => {
                        e.preventDefault();
                        setFocus('');
                        if (embedded) {
                            titleRef.current.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                            });
                        } else {
                            viewport.current.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                            });
                        }
                    }}
                >
                    <IconArrowBigTop size={10} />
                </ActionIcon>
            </Group>
                   </Box>;
        });
        setRows(rowsBody);
    };

    useEffect(() => {
        const dbURL = `${window.location.origin}/api/v1/database`;
        fetch(dbURL)
            .then(response => response.json())
            .then(data => {
                // console.log('headerData fetch', data);
                setHeaderData(data);
            }).catch((error) => {
            console.error('Error:', error);
        });
    }, []);

    useEffect(() => {
        makeRows();
    }, [headerData, updateTable]);

    function setClass(refString: string, className: string) {
        const ref = refs.current[refString?.toLowerCase()];
        if (ref != null) {
            ref.className = className;
        }
    }

    function focusAndScroll() {
        const [header, directive] = focus.split('$');
        const [lastHeader, lastDirective] = lastFocus.split('$');

        if (header != null && header !== '') {
            setClass(lastHeader, classes.inactiveHeader);
            setClass(header, classes.activeHeader);
            const directiveRef = refs.current[focus];
            // console.log("scrolling to directive ref", directiveRef);
            if (directiveRef != null) {
                directiveRef.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
                setClass(lastFocus, classes.inactiveDirective);
                setClass(focus, classes.activeDirective);
            } else {
                const headerRef = refs.current[header];
                if (headerRef != null) {
                    if (embedded) {
                        headerRef.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                        });
                    } else {
                        const y = headerRef.getBoundingClientRect().top + window.scrollY - 55;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                }
            }
            setLastFocus(focus);
        }
    }

    useEffect(() => {
        // console.log("focus changed", focus, lastFocus);
       if (focus !== lastFocus) {
           focusAndScroll();
       }
    }, [focus]);

    useEffect(() => {
        focusAndScroll();
    }, [rows]);

    return (
        <ScrollArea type="auto" h={200} ref={viewport} viewportRef={viewport}>
        <Stack>
            { embedded ? <div /> : <Space h="xl" mt={200} /> }
            <Container>
                <Center>
                    <Text
                        size={embedded ? 36 : 48}
                        sx={{
                            fontFamily: 'Monaco, monospace',
                            fontWeight: 600,
                        }}
                        variant="gradient"
                        gradient={{ from: 'blue', to: 'grape', deg: 200 }}
                        ref={titleRef}
                    >
                        HTTP:DOCS
                    </Text>
                </Center>
                <Space h="xl" />
                {!embedded && <Container>
                                <Title size={20} color="blue"> What are HTTP Headers?</Title>
                                <p>
                                    HTTP headers are a fundamental component of the HTTP protocol, which is the backbone of the internet. These headers contain important information about the request and response, such as content type, caching instructions, authentication tokens, and more. By understanding how to read and manipulate HTTP headers, developers can optimize their web applications for performance, security, and functionality. Moreover, HTTP headers play a critical role in API integrations, allowing developers to communicate with external services and systems. In short, HTTP headers are an essential tool in the web developer's arsenal, and any developer serious about building high-quality web applications should invest the time to learn and master them.
                                </p>
                              </Container>}
                <Space h="xl" />
                <Center>
                    <Select
                        placeholder="Jump to header"
                        searchable
                        clearable
                        onSearchChange={onSearchChange}
                        searchValue={searchValue}
                        nothingFound="No options"
                        icon={<IconSearch size="1rem" />}
                        onChange={(value) => {
                            if (value != null) {
                                setFocus(`${value.toLowerCase()}$`);
                                onSearchChange('');
                            }
                        }}
                        data={headerData.map((header) => header.header)}
                        sx={{
                          width: '260px',
                        }}
                    />
                </Center>
                <Space h="sm" />
            </Container>
            <Container>
                    {rows}
            </Container>
        </Stack>
    </ScrollArea>

);
}
