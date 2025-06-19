# Logging Configuration

## Development vs Production Logging

### Development Environment

In development, logs are written to:
1. **Console** (stdout) - All logs with timestamp format
2. **File** (`logs/app.log`) - Rotating log files up to 10MB each, keeping 5 backups
3. **Debug Level** - More verbose logging for debugging

The `backend.log` file you see is created by uvicorn when running in development mode with file output.

### Production Environment

In production, logs should be handled differently:

1. **Console Only** (stdout/stderr) - No file logging
2. **JSON Format** - Structured logs for better parsing
3. **Warning/Error Level** - Less verbose to reduce noise
4. **Cloud Platform Integration** - Logs are automatically captured by:
   - AWS: CloudWatch Logs
   - Google Cloud: Cloud Logging (formerly Stackdriver)
   - Azure: Application Insights
   - Heroku: Papertrail or similar add-ons

## Configuration

The logging is configured in `config/logging_config.py` based on the environment:

```python
# Development
DB_SCHEMA=dev  # Logs to console and file

# Production
DB_SCHEMA=prod  # Logs to console only in JSON format
```

## Best Practices for Production

1. **No Local Files**: Don't write logs to local files in containers
2. **Structured Logging**: Use JSON format for easier parsing
3. **Centralized Logging**: Use cloud platform logging services
4. **Log Levels**: Use appropriate levels (ERROR, WARNING, INFO)
5. **Sensitive Data**: Never log passwords, API keys, or PII

## Viewing Logs in Production

### AWS ECS/Fargate
```bash
aws logs tail /ecs/ignatian-ai --follow
```

### Google Cloud Run
```bash
gcloud logging read "resource.type=cloud_run_revision" --limit 50
```

### Docker
```bash
docker logs <container-id> --follow
```

### Kubernetes
```bash
kubectl logs <pod-name> -f
```

## Monitoring and Alerts

For production, consider setting up:
1. **Error Rate Alerts** - Alert when error logs spike
2. **Performance Monitoring** - Track response times
3. **Log Aggregation** - Use tools like ELK stack or Datadog
4. **Log Retention** - Set appropriate retention policies

## Security Considerations

1. **PII Protection** - Don't log personal information
2. **API Keys** - Never log secrets or credentials
3. **SQL Queries** - Be careful with query parameters
4. **User Data** - Anonymize or hash sensitive data

## Troubleshooting

If logs aren't appearing in production:
1. Check environment variables are set correctly
2. Ensure container has write permissions
3. Verify cloud logging agent is installed
4. Check IAM permissions for cloud logging