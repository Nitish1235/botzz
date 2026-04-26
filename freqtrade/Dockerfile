FROM freqtradeorg/freqtrade:stable

# Ensure user_data directories exist
RUN mkdir -p /freqtrade/user_data/strategies /freqtrade/user_data/data /freqtrade/user_data/logs

# Copy config and strategy
COPY ./freqtrade/config.json /freqtrade/config.json
COPY ./freqtrade/user_data /freqtrade/user_data

# Set entrypoint to run the bot
# We use --api-port 8080 to ensure it matches Cloud Run's default port
ENTRYPOINT ["freqtrade"]
CMD ["trade", "--config", "/freqtrade/config.json", "--strategy", "SampleStrategy", "--api-port", "8080"]
