import {Card, Avatar, Text, Progress, Badge, Group, ActionIcon, Code, Button, Popover, CopyButton} from '@mantine/core';
import {IconCopy, IconEdit, IconLink, IconRefresh, IconUpload} from '@tabler/icons';

const avatars = [
    'https://avatars.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
];

interface TaskCardProps {
    url: string;
    method: string;
    latency: number;
    status: string;
    statusMsg: string;
    timestamp: string;
    copyURL: string;

    refreshTable: Function;
}

export function TaskCard({ url, status, statusMsg, latency, method, timestamp, copyURL, refreshTable }: TaskCardProps) {

    return (
        <Card withBorder radius="md">
            <Group position="right">
                {/*<IconUpload type="mark" size={28} />*/}
                <Badge
                  color={status == 200 ? 'green' : 'red'}
                >{status} {statusMsg}</Badge>
            </Group>
                <Text size="lg" weight={500} mt="md"
                      sx={{
                          fontFamily: 'Monaco, monospace',
                      }}
                >
                        {method} {url}
                </Text>
                <br/>
            <Text lineClamp={40} size="xs" ><IconEdit size={12}></IconEdit>{' '}User-Agent: Mozilla/5.0 (compatible; http:colon; +https://httpcolon.dev)</Text>
            <Text lineClamp={40} size="xs" ><IconEdit size={12}></IconEdit>{' '}Accept-Encoding: gzip, deflate, br</Text>

                <Text color="dimmed" size="sm" mt="md">
                    Latency:{' '}
                    <Text
                        span
                        weight={500}
                        sx={(theme) => ({ color: theme.colorScheme === 'dark' ? theme.white : theme.black })}
                    >
                        {latency}ms
                    </Text>
                </Text>
                <Progress
                  value={(latency / 1000) * 100} mt={5}
                  color={latency < 200 ? 'green' : latency < 600 ? 'yellow' : latency < 800 ? 'orange' : 'red'}
                />

            <Group position="apart" mt="lg">
                <Group>
                    <Button variant="light" color="grape" size="xs" disabled compact uppercase>
                        {timestamp != null ? new Date(timestamp).toLocaleString() : ''}
                    </Button>
                </Group>
                <Group>
                    <ActionIcon variant="default" onClick={refreshTable}>
                        <IconRefresh size={18} />
                    </ActionIcon>
                    <Popover width="auto" position="top" transition="pop" withArrow>
                        <Popover.Target>
                            <ActionIcon variant="default">
                                <IconUpload size={18} />
                            </ActionIcon>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <CopyButton value={copyURL}>
                                {({ copied, copy }) => (
                                    <Button uppercase variant="light" color="grape" size="xs" rightIcon={<IconCopy />} onClick={copy}>
                                        <Code color="grape">{copyURL.replace(/^https?:\/\//, '').split('?')[0]}</Code>
                                    </Button>
                                )}
                            </CopyButton>
                        </Popover.Dropdown>
                    </Popover>

                </Group>
            </Group>
        </Card>
    );
}