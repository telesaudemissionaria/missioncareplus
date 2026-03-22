// api-config.js - Configuração centralizada de URLs da API
const API_CONFIG = (() => {
  const PRODUCTION_URL = 'https://missioncareplus-jca0.onrender.com';
  const LOCAL_URL = 'http://localhost:10000';

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const BASE_URL = isLocal ? LOCAL_URL : PRODUCTION_URL;

  return Object.freeze({
    BASE_URL,
    ENDPOINTS: Object.freeze({
      TRIAGEM_ADULTO: `${BASE_URL}/analise-triagem-adulto`,
      TRIAGEM_PEDIATRICA: `${BASE_URL}/analise-triagem`,
      EMERGENCIA: `${BASE_URL}/api/v1/assistente`,
      GOB: `${BASE_URL}/api/assistants/run/gob`,
    }),
  });
})();
