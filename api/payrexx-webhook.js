export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const secret = req.query.secret || '';
    if (secret !== process.env.WEBHOOK_SECRET) {
      console.warn('Webhook: invalid secret');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const body = req.body;
    let transaction = null;

    if (body && body.transaction) {
      transaction = body.transaction;
    } else if (body && body['transaction[id]']) {
      transaction = {
        id:      body['transaction[id]'],
        status:  body['transaction[status]'],
        purpose: body['transaction[purpose]'],
        amount:  body['transaction[amount]'],
      };
    }

    if (!transaction) {
      console.warn('Webhook: no transaction data', body);
      return res.status(400).json({ error: 'No transaction data' });
    }

    const status  = (transaction.status || '').toLowerCase();
    const purpose = transaction.purpose || '';
    console.log(`Webhook received: status=${status} purpose="${purpose}"`);

    if (status !== 'confirmed') {
      console.log(`Ignoring status: ${status}`);
      return res.status(200).json({ ignored: true, status });
    }

    const batchMatch = purpose.match(/Batch\s+(\d+)/i);
    if (!batchMatch) {
      console.warn('Webhook: could not parse batch from purpose:', purpose);
      return res.status(200).json({ ignored: true, reason: 'unknown batch' });
    }
    const batchId   = batchMatch[1].padStart(3, '0');
    const countFile = `batch-${batchId}-count.json`;

    let qty = 1;
    const piecesMatch = purpose.match(/(\d+)\s+piece/i);
    const boxesMatch  = purpose.match(/(\d+)\s+x\s+/i);
    if (piecesMatch) {
      qty = parseInt(piecesMatch[1], 10);
    } else if (boxesMatch) {
      qty = parseInt(boxesMatch[1], 10);
    }
    if (isNaN(qty) || qty < 1) qty = 1;

    const owner   = process.env.GITHUB_OWNER;
    const repo    = process.env.GITHUB_REPO;
    const token   = process.env.GITHUB_TOKEN;
    const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${countFile}`;

    const getRes = await fetch(apiBase, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'soloquando-webhook',
      },
    });

    if (!getRes.ok) {
      const err = await getRes.text();
      console.error('GitHub GET failed:', getRes.status, err);
      return res.status(500).json({ error: 'Failed to read count file from GitHub' });
    }

    const fileData = await getRes.json();
    const current  = JSON.parse(
      Buffer.from(fileData.content, 'base64').toString('utf8')
    );

    const oldReserved = current.reserved || 0;
    const max         = current.max || 60;
    const min         = current.min || 10;
    const newReserved = Math.min(oldReserved + qty, max);

    let newStatus = current.status || 'open';
    if (newReserved >= max)      newStatus = 'sold_out';
    else if (newReserved >= min) newStatus = 'confirmed';

    const updated = {
      ...current,
      reserved:   newReserved,
      status:     newStatus,
      updated_at: new Date().toISOString(),
    };

    const updatedBase64 = Buffer.from(
      JSON.stringify(updated, null, 2) + '\n'
    ).toString('base64');

    const putRes = await fetch(apiBase, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'soloquando-webhook',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `order: batch ${batchId} +${qty} (total ${newReserved})`,
        content: updatedBase64,
        sha:     fileData.sha,
      }),
    });

    if (!putRes.ok) {
      const err = await putRes.text();
      console.error('GitHub PUT failed:', putRes.status, err);
      return res.status(500).json({ error: 'Failed to write count file to GitHub' });
    }

    return res.status(200).json({
      ok: true, batch: batchId, qty, reserved: newReserved, status: newStatus,
    });

  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
