import {
    Card,
    Container,
    Text,
    Progress,
    Badge,
    Group,
    ActionIcon,
    Code,
    Button,
    Popover,
    CopyButton,
    Avatar,
    Space,
    Divider,
} from '@mantine/core';
import {IconCopy, IconEdit, IconLink, IconRefresh, IconUpload} from '@tabler/icons';

interface TaskCardProps {
    url: string;
    method: string;
    latency: number;
    status: string;
    statusMsg: string;
    timestamp: string;
    copyURL: string;
    hideRequestParams: boolean;
    clickable: boolean;
    refreshTable: Function;
}

export function TaskCard({ url, status, statusMsg, latency, method, timestamp, copyURL, refreshTable, hideRequestParams, clickable }: TaskCardProps) {

    const strippedUrl = url.replace(/(^\w+:|^)\/\//, '').split('?')[0];
    const href = url ? `/${strippedUrl}` : '/';
    return (
        <Card
          withBorder
          radius="md"
          sx={{
                  ':hover': {
                      boxShadow: 20, // theme.shadows[20]
                  },
              }}
          component={clickable ? 'a' : 'div'}
          href={clickable ? href : ''}
        >
            <Group position="apart">
                {/*<IconUpload type="mark" size={28} />*/}
                <Avatar
                    src={`${url}/favicon.ico`}
                    size="xs"
                    >
                </Avatar>
                <Badge
                  color={status == 200 ? 'green' : 'red'}
                >{status} {statusMsg}</Badge>
            </Group>
            <Space h="sm" />

            <Divider color="gray" size="xs" />

            <Space h="xl" />
            <Group>
                <Badge color={method === 'GET' ? 'grape' : method === 'POST' ? 'pink' : method === 'PUT' ? 'orange' : 'red'} radius="xs" size="md" variant="light">
                    {method}
                </Badge>
                {/*<Space h="sm" />*/}

                <Text size="sm"
                      sx={{
                          fontFamily: 'Monaco, monospace',
                      }}
                >
                    {clickable ? strippedUrl : url}
                </Text>

            </Group>
            {!hideRequestParams && <Container>
                                        <br />
                                        <Text lineClamp={40} size="xs" ><IconEdit size={12}></IconEdit>{' '}User-Agent: Mozilla/5.0 (compatible; http:colon; +https://httpcolon.dev)</Text>
                                        <Text lineClamp={40} size="xs" ><IconEdit size={12}></IconEdit>{' '}Accept-Encoding: gzip, deflate, br</Text>
                                   </Container>}
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
                  animate={clickable}
                />

            <Group position="apart" mt="lg">
                <Group>
                    <Button variant="light" color="grape" size="xs" disabled compact uppercase>
                        {timestamp != null ? new Date(timestamp).toLocaleString() : ''}
                    </Button>
                </Group>
                {!clickable && <Group>
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
                </Group>}
            </Group>
        </Card>
    );
}