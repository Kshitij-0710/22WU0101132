// In src/pages/StatsPage.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, Button, Link, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useLogger } from '../logging/logger';
import { Link as RouterLink } from 'react-router-dom';

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
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress size={40} />
            </Box>
        );
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
            <Card sx={{ width: '100%', maxWidth: 500, p: 2, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom align="center">
                        URL Statistics
                    </Typography>
                    <Button component={RouterLink} to="/" variant="outlined" fullWidth sx={{ mb: 2 }}>
                        Create New URLs
                    </Button>
                    {stats.length === 0 ? (
                        <Typography align="center">No shortened URLs found. Create some on the main page first!</Typography>
                    ) : (
                        stats.map((stat) => (
                            <Box key={stat.shortcode} mb={3}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    <Link href={`${API_BASE_URL}/${stat.shortcode}`} target="_blank" rel="noopener">
                                        {`${API_BASE_URL}/${stat.shortcode}`}
                                    </Link>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Created: {new Date(stat.created_at).toLocaleString()} | Expires: {new Date(stat.expires_at).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Clicks: {stat.clicks}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                                    <strong>Original URL:</strong> <Link href={stat.original_url} target="_blank" rel="noopener">{stat.original_url}</Link>
                                </Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Timestamp</TableCell>
                                            <TableCell>IP Address</TableCell>
                                            <TableCell>Referrer</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {stat.click_details.length > 0 ? stat.click_details.map((click, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                                                <TableCell>{click.ip_address}</TableCell>
                                                <TableCell>{click.referrer || 'N/A'}</TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center">No clicks yet.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Box>
                        ))
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default StatsPage;