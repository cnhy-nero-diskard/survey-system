import { cpuUsageGauge, memoryUsageGauge } from './prometheus.js';

const updateMetrics = () => {
  // Simulate CPU and memory usage for local development
  const simulateCPUUsage = () => Math.random() * 100;
  const simulateMemoryUsage = () => Math.random() * 100;

  cpuUsageGauge.set(simulateCPUUsage());
  memoryUsageGauge.set(simulateMemoryUsage());
};

// Update metrics every 5 seconds
setInterval(updateMetrics, 5000);

export { updateMetrics };