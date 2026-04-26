FROM freqtradeorg/freqtrade:stable

# Create all necessary directories
RUN mkdir -p /freqtrade/user_data/strategies \
    && mkdir -p /freqtrade/user_data/data \
    && mkdir -p /freqtrade/user_data/logs \
    && mkdir -p /freqtrade/user_data/backtests

# Copy your local config and strategies
COPY ./freqtrade/config.json /freqtrade/config.json
COPY ./freqtrade/user_data/strategies /freqtrade/user_data/strategies

# Set the command to run the bot
# The port 8080 is already defined in config.json under 'api_server'
CMD ["trade", "--config", "/freqtrade/config.json", "--strategy", "SampleStrategy", "--db-url", "sqlite:////freqtrade/user_data/data/tradesv3.sqlite"]
