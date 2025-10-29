import React, { useEffect, useState } from 'react';

const LogStream = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const eventSource = new EventSource(`${process.env.REACT_APP_API_HOST}/api/log-stream`);
        eventSource.onmessage = (event) => {
            const log = JSON.parse(event.data);
            setLogs((prevLogs) => [...prevLogs, log]);
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div style={{ backgroundColor: '#2c2c2c', padding: '20px', borderRadius: '10px' }}>
            <h1>API Request Livestream</h1>
            <ul style={{ 
                backgroundColor: '#1e1e1e', 
                color: '#d4d4d4', 
                padding: '10px', 
                borderRadius: '5px', 
                fontFamily: 'monospace', 
                listStyleType: 'none', 
                maxHeight: '400px', 
                overflowY: 'scroll' 
            }}>
                {logs.map((log, index) => (
                    <li key={index} style={{ 
                        borderBottom: '1px solid #333', 
                        padding: '5px 0' 
                    }}>
                        {log}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LogStream;