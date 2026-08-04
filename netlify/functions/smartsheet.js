const nodeFetch = typeof fetch !== 'undefined' ? fetch : require('node-fetch');

exports.handler = async (event) => {
  const TOKEN = process.env.SMARTSHEET_TOKEN;
  const SHEET_ID = '4281939509858180';
  const BASE = 'https://api.smartsheet.com/2.0/sheets/' + SHEET_ID;
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
  };

  // Defensive method detection — works across Netlify Function runtime versions
  const method = (
    event.httpMethod ||
    (event.requestContext && event.requestContext.http && event.requestContext.http.method) ||
    event.method ||
    ''
  ).toUpperCase();

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers: cors, body: '' };
  }

  try {
    if (method === 'GET') {
      const res = await nodeFetch(BASE, {
        headers: { 'Authorization': 'Bearer ' + TOKEN }
      });
      const data = await res.json();
      return {
        statusCode: res.status,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
    }

    if (method === 'POST') {
      const res = await nodeFetch(BASE + '/rows', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
        body: event.body
      });
      const data = await res.json();
      return {
        statusCode: res.status,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
    }

    if (method === 'DELETE') {
      const params = event.queryStringParameters || {};
      const rowId = params.rowId;
      if (!rowId) {
        return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'missing rowId' }) };
      }
      const res = await nodeFetch(BASE + '/rows?ids=' + rowId, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + TOKEN }
      });
      const data = await res.json();
      return {
        statusCode: res.status,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
    }

    // Debug: return what method we actually received
    return {
      statusCode: 405,
      headers: cors,
      body: JSON.stringify({ error: 'Method not allowed', receivedMethod: method, rawHttpMethod: event.httpMethod })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ error: err.message, stack: err.stack })
    };
  }
};

