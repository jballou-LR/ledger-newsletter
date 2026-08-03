exports.handler = async (event) => {
  const TOKEN = process.env.SMARTSHEET_TOKEN;
  const SHEET_ID = '4281939509858180';
  const BASE = 'https://api.smartsheet.com/2.0/sheets/' + SHEET_ID;

  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: cors, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      const res = await fetch(BASE, {
        headers: { 'Authorization': 'Bearer ' + TOKEN }
      });
      const data = await res.json();
      return {
        statusCode: res.status,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
    }

    if (event.httpMethod === 'POST') {
      const res = await fetch(BASE + '/rows', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + TOKEN,
          'Content-Type': 'application/json'
        },
        body: event.body
      });
      const data = await res.json();
      return {
        statusCode: res.status,
        headers: { ...cors, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
    }

    return { statusCode: 405, headers: cors, body: 'Method not allowed' };

  } catch (err) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ error: err.message })
    };
  }
};
