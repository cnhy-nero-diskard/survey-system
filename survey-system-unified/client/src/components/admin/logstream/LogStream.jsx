import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import {
  Terminal as TerminalIcon,
  DeleteOutline as ClearIcon,
  VerticalAlignBottom as FollowIcon,
} from '@mui/icons-material';
import styled from 'styled-components';
import { fontFamily } from '../../../config/fontConfig';
import { gradients } from '../shared/designTokens';

// Cap retained lines. The old implementation appended forever, so a long-lived
// tab grew the array (and the DOM) without bound.
const MAX_LINES = 500;

const PageShell = styled(Box)`
  background: ${gradients.page};
  min-height: 100vh;
  padding: 32px;
  font-family: ${fontFamily};
  box-sizing: border-box;
`;

const HeaderContainer = styled(Box)`
  background: ${gradients.brand};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const HeaderTitle = styled(Typography)`
  font-family: ${fontFamily};
  font-weight: 600;
  font-size: 28px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Console = styled(Box)`
  background-color: #1e1e1e;
  color: #d4d4d4;
  border-radius: 16px;
  padding: 16px;
  font-family: 'Consolas', 'Menlo', monospace;
  font-size: 13px;
  line-height: 1.6;
  height: 60vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
`;

const LogLine = styled.div`
  border-bottom: 1px solid #2f2f2f;
  padding: 4px 0;
  white-space: pre-wrap;
  word-break: break-word;

  &:last-child {
    border-bottom: none;
  }
`;

const EmptyState = styled.div`
  color: #6b7280;
  font-style: italic;
  padding: 24px 0;
  text-align: center;
`;

// The stream may deliver strings or objects; rendering an object directly
// throws "Objects are not valid as a React child".
const formatLog = (log) => {
  if (typeof log === 'string') return log;
  if (log == null) return '';
  try {
    return JSON.stringify(log);
  } catch {
    return String(log);
  }
};

const LogStream = () => {
  const [logs, setLogs] = useState([]);
  const [connected, setConnected] = useState(false);
  const [follow, setFollow] = useState(true);
  const consoleRef = useRef(null);

  useEffect(() => {
    const eventSource = new EventSource(`${process.env.REACT_APP_API_HOST}/api/log-stream`);

    eventSource.onopen = () => setConnected(true);

    eventSource.onmessage = (event) => {
      let log;
      try {
        log = JSON.parse(event.data);
      } catch {
        // Not every frame is guaranteed to be JSON; keep the raw text rather
        // than dropping the line on a parse error.
        log = event.data;
      }
      setLogs((prevLogs) => [...prevLogs, log].slice(-MAX_LINES));
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      setConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    if (follow && consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs, follow]);

  return (
    <PageShell>
      <HeaderContainer>
        <Box>
          <HeaderTitle>
            <TerminalIcon sx={{ fontSize: 32 }} />
            API Request Livestream
          </HeaderTitle>
          <Typography variant="subtitle1" sx={{ fontFamily, opacity: 0.9, mt: 0.5 }}>
            Live server log output, newest at the bottom
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            size="small"
            label={connected ? 'Connected' : 'Disconnected'}
            sx={{
              color: 'white',
              fontFamily,
              border: '1px solid rgba(255,255,255,0.35)',
              backgroundColor: connected ? 'rgba(52, 211, 153, 0.35)' : 'rgba(239, 68, 68, 0.35)',
            }}
          />
          <Tooltip title={follow ? 'Auto-scroll on' : 'Auto-scroll off'}>
            <IconButton
              onClick={() => setFollow((f) => !f)}
              aria-label="Toggle auto-scroll"
              sx={{ color: 'white', opacity: follow ? 1 : 0.5 }}
            >
              <FollowIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear log">
            <IconButton onClick={() => setLogs([])} aria-label="Clear log" sx={{ color: 'white' }}>
              <ClearIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </HeaderContainer>

      <Console ref={consoleRef}>
        {logs.length === 0 ? (
          <EmptyState>
            {connected ? 'Waiting for requests…' : 'Not connected to the log stream.'}
          </EmptyState>
        ) : (
          logs.map((log, index) => <LogLine key={index}>{formatLog(log)}</LogLine>)
        )}
      </Console>
    </PageShell>
  );
};

export default LogStream;
