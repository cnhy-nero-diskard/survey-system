import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Typography } from "@mui/material";
import { ChartContainer, MainContent, ChartContainer as PieChartContainer } from '../../shared/styledComponents';
import axios from "axios";

const LocSpecificTopic = ({ short_id }) => {
    const [pieData, setPieData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('SELECTED SHORT ID --> ', short_id);
        const fetchData = async () => {
            try {
                // Check if cached data exists in localStorage
                const cachedData = localStorage.getItem(`sentimentData2_${short_id}`);
                const cachedTimestamp = localStorage.getItem(`sentimentDataTimestamp2_${short_id}`);

                // If cached data exists and is less than 5 minutes old, use it
                if (cachedData && cachedTimestamp && Date.now() - cachedTimestamp < 30000) { // 300000ms = 5 minutes
                    const { counts, positive, neutral, negative } = JSON.parse(cachedData);
                    processData(counts, positive, neutral, negative);
                    setLoading(false);
                    return;
                }

                // Fetch new data from the API
                const sentimentResponse = await axios.post(
                    `${process.env.REACT_APP_API_HOST}/api/admin/getsentimenttableforlocation`,
                    { short_id },
                    { withCredentials: true }
                );
                const { counts, positive, neutral, negative } = sentimentResponse.data;
                console.log(`Fetched Data for ${short_id}:`, sentimentResponse.data);

                // Cache the new data in localStorage
                localStorage.setItem(`sentimentData2_${short_id}`, JSON.stringify(sentimentResponse.data));
                localStorage.setItem(`sentimentDataTimestamp2_${short_id}`, Date.now());

                // Process the data for the pie chart
                processData(counts, positive, neutral, negative);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        const processData = async (counts, positive, neutral, negative) => {
            // Fetch custom labels for each sentiment category
            const fetchCustomLabels = async (texts, sentiment) => {
                if (texts.length === 0) return null;
                const response = await axios.post(
                    `${process.env.REACT_APP_API_HOST}/api/analyzetopics`,
                    { text: texts.join("\n"), tokenLabel: "DEV_free" },
                    { withCredentials: true }
                );
                return response.data[0]?.customLabel || null;
            };

            const positiveLabel = positive.length > 0 ? await fetchCustomLabels(positive, "positive") : "";
            const neutralLabel = neutral.length > 0 ? await fetchCustomLabels(neutral, "neutral") : "";
            const negativeLabel = negative.length > 0 ? await fetchCustomLabels(negative, "negative") : "";

            console.log('POSITIVE LABEL --> ', positiveLabel);
            console.log('NEUTRAL LABEL --> ', neutralLabel);
            console.log('NEGATIVE LABEL --> ', negativeLabel);

            // Prepare pie chart data with updated colors
            const data = [];
            if (counts.positive !== "0" && positiveLabel) {
                data.push({ name: `Positive (${positiveLabel})`, value: parseInt(counts.positive), color: "#1f78b4" }); // Blue
            }
            if (counts.neutral !== "0" && neutralLabel) {
                data.push({ name: `Neutral (${neutralLabel})`, value: parseInt(counts.neutral), color: "rgb(255, 196, 0)" }); // Yellow
            }
            if (counts.negative !== "0" && negativeLabel) {
                data.push({ name: `Negative (${negativeLabel})`, value: parseInt(counts.negative), color: "#e31a1c" }); // Red
            }

            console.log(`PIE DATA --> ${JSON.stringify(data)}`);
            setPieData([...data]); // Ensure a new array is created
        };

        fetchData();
    }, [short_id]); // Add short_id as a dependency

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (pieData.length === 0) {
        return <Typography>No data available</Typography>;
    }

    return (
        <MainContent>
            <PieChartContainer>
                <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart key={pieData}>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </PieChartContainer>
        </MainContent>
    );
};

export default LocSpecificTopic;