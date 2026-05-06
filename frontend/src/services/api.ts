import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

export const predictPower = async (data: any) => {
  const response = await api.post('/predict', data);
  return response.data;
};



export const getTestData = async (modelType: string = 'rf') => {
  const response = await api.get(`/test-data?model_type=${modelType}`);
  return response.data;
};
