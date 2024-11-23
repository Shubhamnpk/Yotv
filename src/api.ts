const API_BASE = 'https://iptv-org.github.io/api';

export const fetchChannels = async () => {
  const response = await fetch(`${API_BASE}/channels.json`);
  return response.json();
};

export const fetchStreams = async () => {
  const response = await fetch(`${API_BASE}/streams.json`);
  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE}/categories.json`);
  return response.json();
};

export const fetchLanguages = async () => {
  const response = await fetch(`${API_BASE}/languages.json`);
  return response.json();
};