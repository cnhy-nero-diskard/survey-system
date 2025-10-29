import prometheus from 'prom-client';

// Create a Registry to register metrics
const register = new prometheus.Registry();

// Enable default metrics (e.g., CPU, memory, event loop lag)
prometheus.collectDefaultMetrics({ register });

// Define custom metrics
const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in milliseconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500], // Define your buckets
});

const cpuUsageGauge = new prometheus.Gauge({
  name: 'cpu_usage_percent',
  help: 'Current CPU usage in percent',
});

const memoryUsageGauge = new prometheus.Gauge({
  name: 'memory_usage_percent',
  help: 'Current memory usage in percent',
});

// Register custom metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(cpuUsageGauge);
register.registerMetric(memoryUsageGauge);

// Export the metrics and register
export {
  register,
  httpRequestDurationMicroseconds,
  cpuUsageGauge,
  memoryUsageGauge,
};