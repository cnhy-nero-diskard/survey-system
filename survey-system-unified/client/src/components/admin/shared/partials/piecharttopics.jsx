import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Typography, Skeleton, CircularProgress } from "@mui/material";
import axios from "axios";
import { fontFamily } from "../../../../config/fontConfig";
import { sentimentPalette, text } from "../designTokens";

const CACHE_TTL_MS = 30000;

// Matches the custom label used by the "General Sentiment" pie beside this one:
// percentage inside the slice, nothing under 5%.
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            fontSize="12"
            fontWeight="600"
            fontFamily={fontFamily}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

// `total` is passed in: a Pie tooltip's payload only holds the hovered slice.
const CustomTooltip = ({ active, payload, total = 0 }) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0];
    return (
        <Box
            sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                fontFamily,
            }}
        >
            <Typography variant="body2" sx={{ fontWeight: 600, color: data.payload.color }}>
                {data.payload.name}
            </Typography>
            <Typography variant="body2" sx={{ color: text.body }}>
                Count: {data.value}
            </Typography>
            {total > 0 && (
                <Typography variant="body2" sx={{ color: text.muted }}>
                    {((data.value / total) * 100).toFixed(1)}%
                </Typography>
            )}
        </Box>
    );
};

const CenteredMessage = ({ children }) => (
    <Box
        sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            px: 2,
        }}
    >
        <Typography variant="body2" sx={{ fontFamily, color: text.muted }}>
            {children}
        </Typography>
    </Box>
);

const LocSpecificTopic = ({ short_id }) => {
    const [pieData, setPieData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const processData = async (counts = {}, positive = [], neutral = [], negative = []) => {
            const fetchCustomLabels = async (texts) => {
                if (!texts || texts.length === 0) return null;
                try {
                    const response = await axios.post(
                        `${process.env.REACT_APP_API_HOST}/api/analyzetopics`,
                        { text: texts.join("\n"), tokenLabel: "DEV_free" },
                        { withCredentials: true }
                    );
                    return response.data[0]?.customLabel || null;
                } catch (error) {
                    // Topic enrichment must not hide the sentiment data when
                    // the optional AI service is unavailable.
                    console.warn('Unable to fetch topic label:', error);
                    return null;
                }
            };

            const [positiveLabel, neutralLabel, negativeLabel] = await Promise.all([
                fetchCustomLabels(positive),
                fetchCustomLabels(neutral),
                fetchCustomLabels(negative),
            ]);

            // Colours come from the shared sentiment scale. Topic labels are
            // optional; valid sentiment counts must always produce slices.
            const data = [];
            const positiveCount = Number(counts.positive) || 0;
            const neutralCount = Number(counts.neutral) || 0;
            const negativeCount = Number(counts.negative) || 0;

            if (positiveCount > 0) {
                data.push({ name: positiveLabel ? `Positive (${positiveLabel})` : 'Positive', value: positiveCount, color: sentimentPalette.positive });
            }
            if (neutralCount > 0) {
                data.push({ name: neutralLabel ? `Neutral (${neutralLabel})` : 'Neutral', value: neutralCount, color: sentimentPalette.neutral });
            }
            if (negativeCount > 0) {
                data.push({ name: negativeLabel ? `Negative (${negativeLabel})` : 'Negative', value: negativeCount, color: sentimentPalette.negative });
            }

            if (!cancelled) setPieData(data);
        };

        const fetchData = async () => {
            setLoading(true);
            try {
                const cachedData = localStorage.getItem(`sentimentData2_${short_id}`);
                const cachedTimestamp = localStorage.getItem(`sentimentDataTimestamp2_${short_id}`);

                if (cachedData && cachedTimestamp && Date.now() - Number(cachedTimestamp) < CACHE_TTL_MS) {
                    const { counts, positive, neutral, negative } = JSON.parse(cachedData);
                    await processData(counts, positive, neutral, negative);
                    return;
                }

                const sentimentResponse = await axios.post(
                    `${process.env.REACT_APP_API_HOST}/api/admin/getsentimenttableforlocation`,
                    { short_id },
                    { withCredentials: true }
                );
                const { counts, positive, neutral, negative } = sentimentResponse.data;

                localStorage.setItem(`sentimentData2_${short_id}`, JSON.stringify(sentimentResponse.data));
                localStorage.setItem(`sentimentDataTimestamp2_${short_id}`, String(Date.now()));

                await processData(counts, positive, neutral, negative);
            } catch (error) {
                console.error("Error fetching location sentiment:", error);
                if (!cancelled) setPieData([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        if (!short_id) {
            setPieData([]);
            setLoading(false);
            return undefined;
        }

        fetchData();
        return () => { cancelled = true; };
    }, [short_id]);

    // A bare "Loading..." line was the only text-only loading state left in the
    // admin UI; every sibling card uses a skeleton.
    if (loading) {
        return (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <CircularProgress size={28} thickness={4} sx={{ color: sentimentPalette.positive }} aria-label="Loading topic sentiment" />
                <Skeleton variant="circular" width={160} height={160} />
                <Box display="flex" gap={1}>
                    <Skeleton variant="rectangular" width={64} height={14} />
                    <Skeleton variant="rectangular" width={64} height={14} />
                    <Skeleton variant="rectangular" width={64} height={14} />
                </Box>
            </Box>
        );
    }

    if (!short_id) {
        return <CenteredMessage>Select an entity to see its topic sentiment.</CenteredMessage>;
    }

    if (pieData.length === 0) {
        return <CenteredMessage>No topic sentiment available for this selection.</CenteredMessage>;
    }

    const total = pieData.reduce((sum, item) => sum + item.value, 0);

    return (
        // Previously wrapped in MainContent > ChartContainer > ChartContainer —
        // three nested boxes (two of them the same component, imported twice
        // under different names) each adding padding around a 280px chart.
        <Box sx={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={2}
                        labelLine={false}
                        label={renderCustomLabel}
                    >
                        {pieData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke="#ffffff"
                                strokeWidth={2}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip total={total} />} />
                    <Legend
                        wrapperStyle={{ fontFamily, fontSize: '12px', paddingTop: '10px' }}
                        iconType="circle"
                    />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default LocSpecificTopic;
