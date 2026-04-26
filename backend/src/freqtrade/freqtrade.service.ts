import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FreqtradeService {
  private readonly logger = new Logger(FreqtradeService.name);
  private readonly baseUrl = process.env.FREQTRADE_URL || 'http://localhost:8080/api/v1';
  
  // Default credentials (to be updated via env or config)
  private readonly username = 'Freqtrader';
  private readonly password = 'SuperSecret1!';

  private get authHeader() {
    return {
      Authorization: `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`,
    };
  }

  async getPing() {
    try {
      const response = await axios.get(`${this.baseUrl}/ping`, { headers: this.authHeader });
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to ping Freqtrade: ${error.message}`);
      return { status: 'error', message: error.message };
    }
  }

  async getStatus() {
    try {
      const response = await axios.get(`${this.baseUrl}/status`, { headers: this.authHeader });
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get Freqtrade status: ${error.message}`);
      throw error;
    }
  }

  async getTrades(limit = 500) {
    try {
      const response = await axios.get(`${this.baseUrl}/trades?limit=${limit}`, { headers: this.authHeader });
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get Freqtrade trades: ${error.message}`);
      throw error;
    }
  }

  async getPerformance() {
    try {
      const response = await axios.get(`${this.baseUrl}/performance`, { headers: this.authHeader });
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get Freqtrade performance: ${error.message}`);
      throw error;
    }
  }

  async getProfit() {
    try {
      const response = await axios.get(`${this.baseUrl}/profit`, { headers: this.authHeader });
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get Freqtrade profit: ${error.message}`);
      throw error;
    }
  }

  async getBalance() {
    try {
      const response = await axios.get(`${this.baseUrl}/balance`, { headers: this.authHeader });
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get Freqtrade balance: ${error.message}`);
      throw error;
    }
  }
}
