FROM freqtradeorg/freqtrade:stable

# Copy config and strategy
COPY ./freqtrade/config.json /freqtrade/config.json
COPY ./freqtrade/user_data /freqtrade/user_data

# Set entrypoint to run the bot
ENTRYPOINT ["freqtrade"]
CMD ["trade", "--config", "/freqtrade/config.json", "--strategy", "SampleStrategy"]
