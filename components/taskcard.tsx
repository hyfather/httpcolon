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
  createStyles,
  Tooltip,
  Anchor,
  Loader,
} from '@mantine/core';
import {
  IconCopy,
  IconEdit,
  IconLink,
  IconRefresh,
  IconSettings,
  IconUpload,
  IconWorld,
} from '@tabler/icons';
import { useEffect, useState } from 'react';
import { format } from 'timeago.js';

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

const useStyles = createStyles((theme) => ({
  card: {
    // backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    backgroundImage:
      theme.colorScheme === 'dark'
        ? theme.fn.gradient({
            from: theme.colors.grape[9],
            to: theme.colors.blue[9],
            deg: 200,
          })
        : theme.fn.gradient({
            from: theme.colors.gray[1],
            to: theme.colors.gray[2],
            deg: 200,
          }),
  },

  sectionHeader: {
    backgroundImage:
      theme.colorScheme === 'dark'
        ? theme.fn.gradient({
            from: theme.colors.gray[7],
            to: theme.colors.gray[9],
            deg: 200,
          })
        : theme.fn.gradient({
            from: theme.colors.gray[3],
            to: theme.colors.gray[5],
            deg: 200,
          }),
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  section: {
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  like: {
    color: theme.colors.red[6],
  },

  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

export function TaskCard({
  url,
  status,
  statusMsg,
  latency,
  method,
  timestamp,
  copyURL,
  refreshTable,
  hideRequestParams,
  clickable,
}: TaskCardProps) {
  const { classes, theme } = useStyles();
  const timestamp_ = new Date(timestamp);

  const strippedUrl = url ? url.replace(/(^\w+:|^)\/\//, '').split('?')[0] : '';
  const href = url ? `/${strippedUrl}` : '/';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    status && setLoading(false);
  }, [status]);

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
      className={classes.card}
      shadow="md"
    >
      <Card.Section className={classes.sectionHeader} pt="sm">
        <Group position="apart">
          {/*<IconUpload type="mark" size={28} />*/}
          <Text
            size="md"
            sx={{
              fontFamily: 'Monaco, monospace',
            }}
          >
            {clickable ? strippedUrl : url}
          </Text>

          {loading ? (
            <Loader color="black" />
          ) : (
            <Avatar src={`${url}/favicon.ico`} size={clickable ? 'xs' : 'md'}>
              <IconWorld size={clickable ? 12 : 16} />
            </Avatar>
          )}
        </Group>
      </Card.Section>

      {!loading && (
        <Card.Section className={classes.section}>
          <Space h="md" />

          <Group position="left" spacing={5}>
            <Badge
              color={
                status < 300
                  ? 'green'
                  : status < 400
                    ? 'pink'
                    : status < 500
                      ? 'orange'
                      : 'red'
              }
              radius="xs"
              size="md"
              variant={clickable ? 'light' : 'filled'}
            >
              {method}
            </Badge>
            <Badge
              radius="xs"
              size="md"
              variant={clickable ? 'light' : 'filled'}
              color={
                status < 300
                  ? 'green'
                  : status < 400
                    ? 'pink'
                    : status < 500
                      ? 'orange'
                      : 'red'
              }
            >
              {status} {statusMsg}
            </Badge>
            <Badge
              radius="xs"
              size="md"
              variant={clickable ? 'light' : 'filled'}
              color="blue"
            >
              356 KB
            </Badge>

            {/*<Space h="sm" />*/}
          </Group>
          {!hideRequestParams && (
            <Container>
              <br />
              <Text lineClamp={40} size="xs">
                <IconEdit size={12} /> User-Agent: Mozilla/5.0 (compatible;
                http:colon; +https://httpcolon.dev)
              </Text>
              <Text lineClamp={40} size="xs">
                <IconEdit size={12} /> Accept-Encoding: gzip, deflate, br
              </Text>
            </Container>
          )}

          <Text color="dimmed" size="sm" mt="md">
            Latency:{' '}
            <Text
              span
              weight={500}
              sx={(theme) => ({
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,
              })}
            >
              {latency}ms
            </Text>
          </Text>

          <Progress
            value={(latency / 1000) * 100}
            mt={5}
            color={
              latency < 200
                ? 'green'
                : latency < 600
                  ? 'yellow'
                  : latency < 800
                    ? 'orange'
                    : 'red'
            }
            animate={clickable}
          />
        </Card.Section>
      )}
      {!loading && (
        <Card.Section className={classes.section}>
          <Group position="apart" mt="lg">
            <Group>
              {!clickable && (
                <Badge
                  radius="xs"
                  size="md"
                  variant={clickable ? 'outline' : 'filled'}
                  color="gray"
                  mt={4}
                >
                  {format(timestamp_)}
                </Badge>
              )}
              {!clickable && (
                <Anchor href="#headers">
                  <Badge
                    radius="xs"
                    size="md"
                    variant={clickable ? 'light' : 'filled'}
                    color="grape"
                  >
                    Headers
                  </Badge>
                </Anchor>
              )}
            </Group>
            {!clickable && (
              <Group>
                <ActionIcon variant="filled" onClick={refreshTable}>
                  <IconRefresh size={18} />
                </ActionIcon>
                <Popover width="auto" position="top" transition="pop" withArrow>
                  <Popover.Target>
                    <ActionIcon variant="filled">
                      <IconUpload size={18} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <CopyButton value={copyURL}>
                      {({ copied, copy }) => (
                        <Button
                          uppercase
                          variant="light"
                          color="grape"
                          size="xs"
                          rightIcon={<IconCopy />}
                          onClick={copy}
                        >
                          <Code color="grape">
                            {copyURL.replace(/^https?:\/\//, '').split('?')[0]}
                          </Code>
                        </Button>
                      )}
                    </CopyButton>
                  </Popover.Dropdown>
                </Popover>
              </Group>
            )}
          </Group>
        </Card.Section>
      )}
    </Card>
  );
}
