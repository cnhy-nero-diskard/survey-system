export const parseMetrics = (metricsText) => {
    const lines = metricsText.split('\n');
    const metrics = [];
  
    lines.forEach((line) => {
      if (line.startsWith('#') || line.trim() === '') return; // Skip comments and empty lines
  
      const [name, value] = line.split(' ');
      const metric = {
        name,
        value: parseFloat(value),
      };
  
      // Handle labels (e.g., `metric_name{label="value"}`)
      if (name.includes('{')) {
        const [metricName, labels] = name.split('{');
        metric.name = metricName;
        metric.labels = labels
          .replace('}', '')
          .split(',')
          .map((label) => {
            const [key, val] = label.split('=');
            return { key, value: val.replace(/"/g, '') };
          });
      }
  
      metrics.push(metric);
    });
  
    return metrics;
  };