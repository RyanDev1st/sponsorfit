/**
 * SponsorFit — Qloo API Client
 *
 * Official Qloo API Documentation Citations:
 * - Hackathon Base URL & Header:
 *   https://docs.qloo.com/reference/qloo-llm-hackathon-developer-guide
 *   Requires https://hackathon.api.qloo.com with header `X-Api-Key`.
 * - Entity Search v2:
 *   https://docs.qloo.com/reference/get-search
 *   GET /search?query={query}&types={types}
 * - Insights API v2:
 *   https://docs.qloo.com/reference/insights-api-deep-dive
 *   GET /v2/insights?filter.type={filterType}&signal.interests.entities={entityIds}&feature.explainability=true
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const HACKATHON_BASE_URL = 'https://hackathon.api.qloo.com';

export class QlooClient {
  constructor(options = {}) {
    this.apiKey = options.apiKey !== undefined ? options.apiKey : (process.env.QLOO_API_KEY || '');
    this.baseUrl = (options.baseUrl || HACKATHON_BASE_URL).replace(/\/+$/, '');
    this.fetchFn = options.fetchFn || globalThis.fetch;
    this.mockDir = options.mockDir || path.resolve(__dirname, './mocks');
  }

  isMockMode() {
    return !this.apiKey || this.apiKey.trim().length === 0;
  }

  /**
   * Reads a JSON mock fixture from disk.
   */
  readMock(filename) {
    const filePath = path.resolve(this.mockDir, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  }

  /**
   * Search Entities by query and type.
   * Documentation: https://docs.qloo.com/reference/get-search
   *
   * @param {string} query Search text
   * @param {string} [types] Entity type URN (e.g. urn:entity:brand, urn:entity:artist)
   * @returns {Promise<object>} Official Qloo search response
   */
  async searchEntities(query, types) {
    if (this.isMockMode()) {
      const mockData = this.readMock('search-results.json');
      const q = String(query || '').toLowerCase().trim();
      const filtered = mockData.results.filter((ent) => {
        const matchesQuery = !q || ent.name.toLowerCase().includes(q) || ent.id.toLowerCase().includes(q);
        const matchesType = !types || ent.type === types;
        return matchesQuery && matchesType;
      });

      return {
        success: true,
        isMock: true,
        duration: 0.015,
        results: filtered.length > 0 ? filtered : mockData.results.slice(0, 3),
      };
    }

    const params = new URLSearchParams({ query });
    if (types) params.set('types', types);

    const url = `${this.baseUrl}/search?${params.toString()}`;
    const res = await this.fetchFn(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': this.apiKey.trim(),
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Qloo Search API error (HTTP ${res.status}): ${text}`);
    }

    const data = await res.json();
    return { ...data, isMock: false };
  }

  /**
   * Generates Taste Insights for a given filter.type and input entity signals.
   * Documentation: https://docs.qloo.com/reference/insights-api-deep-dive
   *
   * @param {object} options
   * @param {string} options.filterType Target entity type URN (e.g. urn:entity:brand)
   * @param {string[]} options.signalEntityIds Array of Qloo entity UUIDs
   * @param {boolean} [options.explainability=true] Whether to request explainability metadata
   * @returns {Promise<object>} Official Qloo insights response
   */
  async getInsights(options = {}) {
    const {
      filterType = 'urn:entity:brand',
      signalEntityIds = [],
      explainability = true,
    } = options;

    if (this.isMockMode()) {
      if (filterType === 'urn:entity:brand') {
        const mockBrands = this.readMock('insights-brands.json');
        return { ...mockBrands, isMock: true };
      }

      const mockCross = this.readMock('insights-cross-domain.json');
      return { ...mockCross, isMock: true };
    }

    const params = new URLSearchParams({
      'filter.type': filterType,
      'bias.trends': 'medium',
    });

    if (signalEntityIds.length > 0) {
      params.set('signal.interests.entities', signalEntityIds.join(','));
    }

    if (explainability) {
      params.set('feature.explainability', 'true');
    }

    const url = `${this.baseUrl}/v2/insights?${params.toString()}`;
    const res = await this.fetchFn(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': this.apiKey.trim(),
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Qloo Insights API error (HTTP ${res.status}): ${text}`);
    }

    const data = await res.json();
    return { ...data, isMock: false };
  }
}

export const defaultQlooClient = new QlooClient();
