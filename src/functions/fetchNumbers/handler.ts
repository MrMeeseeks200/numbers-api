import { formatCORSResponse, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import Redis from 'ioredis';
import { FetchNumbersEvent, History, Record } from './types';
import generateNumbers from './generate-numbers';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

const fetchNumbers = async (event: FetchNumbersEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return formatCORSResponse();
  }
  const { queryStringParameters: { "session-id": sessionId } } = event

  const history = await fetchHistory(sessionId)

  const result = generateNumbers(history)

  const newHistory = await updateHistory(sessionId, history, result)

  return formatJSONResponse({
    result,
    history: newHistory,
  });
};

const fetchHistory = async (sessionId: string) => {
  // wait for redis to be ready
  if (redis.status !== 'ready') {
    await new Promise((resolve, reject) => {
      redis.once('ready', resolve);
      redis.once('error', reject);
    });
  }

  const historyStr = await redis.get(sessionId)
  const history: History = historyStr ? JSON.parse(historyStr) : []

  return history
}

const updateHistory = async (sessionId: string, history: History, newEntry: Record) => {
  const updatedHistory = [...history, newEntry]
  await redis.set(sessionId, JSON.stringify(updatedHistory), 'EX', 300) // expire in 5 minutes
  return updatedHistory
}

export const main = middyfy(fetchNumbers);
