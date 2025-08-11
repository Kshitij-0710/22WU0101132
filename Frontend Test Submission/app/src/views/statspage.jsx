// In src/pages/StatsPage.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Link, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLogger } from '../logging/logger';

const API_BASE_URL = 'http://127.0.0.1:8000';

const StatsPage = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const { log } = useLogger();

    useEffect(() => {
        const fetchStats = async () => {
            log('info', 'page', 'Stats page loaded, fetching data.');
            const savedShortcodes = JSON.parse(localStorage.getItem('shortcodes') || '[]');

            if (savedShortcodes.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const promises = savedShortcodes.map(shortcode =>
                    fetch(`${API_BASE_URL}/shorturls/${shortcode}/`).then(res => res.json())
                );

                const results = await Promise.all(promises);
                setStats(results);
                log('info', 'api', 'Successfully fetched stats for all saved shortcodes.');
            } catch (error) {
                const truncatedError = error.message.substring(0, 40);
                log('error', 'api', `Failed to fetch stats: ${truncatedError}`);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [log]); // Dependency array ensures this runs only once on mount

    if (loading) {
        return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                    URL Statistics
                </Typography>
                {stats.length === 0 ? (
                    <Typography>No shortened URLs found. Create some on the main page first!</Typography>
                ) : (
                    stats.map((stat) => (
                        <Accordion key={stat.shortcode}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box display="flex" justifyContent="space-between" width="100%" pr={2}>
                                    <Typography>
                                        <Link href={`${API_BASE_URL}/${stat.shortcode}`} target="_blank" rel="noopener">
                                            {`${API_BASE_URL}/${stat.shortcode}`}
                                        </Link>
                                    </Typography>
                                    <Typography color="text.secondary">Clicks: {stat.clicks}</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Original URL:</strong> <Link href={stat.original_url} target="_blank" rel="noopener">{stat.original_url}</Link>
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Created:</strong> {new Date(stat.created_at).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Expires:</strong> {new Date(stat.expires_at).toLocaleString()}
                                </Typography>
                                <Typography variant="subtitle1" mt={2}>Click Details</Typography>
                                {stat.click_details.length > 0 ? (
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Timestamp</TableCell>
                                                <TableCell>IP Address</TableCell>
                                                <TableCell>Referrer</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stat.click_details.map((click, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                                                    <TableCell>{click.ip_address}</TableCell>
                                                    <TableCell>{click.referrer || 'N/A'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <Typography variant="body2">No clicks yet.</Typography>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export default StatsPage;