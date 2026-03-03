const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const express = require('express');
const cors = require('cors');

const serviceAccount = require('./service-account.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const app = express();
app.use(cors());
app.use(express.json());

const authenticate = async (req, res, next) => {
  // DEV MODE: Skip auth
  return next();

  if (req.path === '/' || req.path === '/api/health') return next();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized: Missing or invalid Bearer token.' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = await getAuth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized: Invalid ID token.' });
  }
};

app.use(authenticate);

const success = (data) => ({ status: 'success', data });
const error = (msg) => ({ status: 'error', message: msg });

// Root
app.get('/', (req, res) => {
  const status = !!db ? '<span class="status-up">ONLINE</span>' : '<span class="status-down">OFFLINE</span>';
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ChromaBase API | Explorer</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
        <style>
            :root {
                --bg: #0a0a0b;
                --surface: #141417;
                --primary: #2c3892;
                --primary-glow: rgba(44, 56, 146, 0.4);
                --text: #f4f4f5;
                --text-muted: #a1a1aa;
                --border: #27272a;
                --success: #10b981;
                --error: #ef4444;
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                background: var(--bg); 
                color: var(--text); 
                font-family: 'Inter', sans-serif; 
                line-height: 1.5;
                padding: 40px 20px;
            }
            .container { max-width: 1000px; margin: 0 auto; }
            header { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                margin-bottom: 48px;
                padding-bottom: 24px;
                border-bottom: 1px solid var(--border);
            }
            h1 { font-size: 24px; font-weight: 700; letter-spacing: -0.025em; display: flex; align-items: center; gap: 12px; }
            .badge { 
                font-family: 'JetBrains Mono', monospace; 
                font-size: 12px; 
                padding: 4px 12px; 
                border-radius: 100px; 
                background: var(--surface);
                border: 1px solid var(--border);
            }
            .status-up { color: var(--success); }
            .status-down { color: var(--error); }
            
            .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(450px, 1fr)); gap: 24px; }
            section { 
                background: var(--surface); 
                border: 1px solid var(--border); 
                border-radius: 12px; 
                padding: 24px;
                transition: border-color 0.2s;
            }
            section:hover { border-color: var(--primary); }
            h2 { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
            
            .route { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; font-family: 'JetBrains Mono', monospace; font-size: 13px; }
            .method { 
                font-weight: 700; 
                width: 60px; 
                padding: 2px 6px; 
                border-radius: 4px; 
                text-align: center;
                background: #27272a;
            }
            .GET { color: #60a5fa; }
            .POST { color: #34d399; }
            .PUT { color: #fbbf24; }
            .DELETE { color: #f87171; }
            .path { color: var(--text); }
            
            .commands { margin-top: 48px; }
            code-box {
                display: block;
                background: #000;
                padding: 16px;
                border-radius: 8px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 13px;
                border: 1px solid var(--border);
                color: #d4d4d8;
                margin-bottom: 8px;
            }

            footer { margin-top: 80px; text-align: center; color: var(--text-muted); font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>🚀 ChromaBase <span>API</span></h1>
                <div class="badge">Firestore: ${status}</div>
            </header>

            <div class="grid">
                <section>
                    <h2>Clients & Leads</h2>
                    <div class="route"><span class="method GET">GET</span> <span class="path">/api/clients</span></div>
                    <div class="route"><span class="method POST">POST</span> <span class="path">/api/clients</span></div>
                    <div class="route"><span class="method GET">GET</span> <span class="path">/api/leads</span></div>
                    <div class="route"><span class="method PUT">PUT</span> <span class="path">/api/leads/:id</span></div>
                </section>

                <section>
                    <h2>Tasks (Advanced)</h2>
                    <div class="route"><span class="method GET">GET</span> <span class="path">/api/tasks</span></div>
                    <div class="route"><span class="method POST">POST</span> <span class="path">/api/tasks/bulk-delete</span></div>
                    <div class="route"><span class="method PUT">PUT</span> <span class="path">/api/tasks/bulk-update</span></div>
                    <div class="route"><span class="method PUT">PUT</span> <span class="path">/api/tasks/:id</span></div>
                </section>

                <section>
                    <h2>Finance & Lifecycle</h2>
                    <div class="route"><span class="method GET">GET</span> <span class="path">/api/proposals</span></div>
                    <div class="route"><span class="method POST">POST</span> <span class="path">/api/proposals</span></div>
                    <div class="route"><span class="method GET">GET</span> <span class="path">/api/quotes</span></div>
                    <div class="route"><span class="method GET">GET</span> <span class="path">/api/stats</span></div>
                </section>

                <section>
                    <h2>Marketing & Growth</h2>
                    <div class="route"><span class="method GET">GET</span> <span class="path">/api/campaigns</span></div>
                    <div class="route"><span class="method POST">POST</span> <span class="path">/api/campaigns</span></div>
                    <div class="route"><span class="method GET">GET</span> <span class="path">/api/activities</span></div>
                </section>

                <section>
                    <h2>Team & Engagement</h2>
                    <div class="route"><span class="method GET">GET</span> <span class="path">/api/team</span></div>
                    <div class="route"><span class="method POST">POST</span> <span class="path">/api/team</span></div>
                    <div class="route"><span class="method GET">GET</span> <span class="path">/api/notifications</span></div>
                    <div class="route"><span class="method POST">POST</span> <span class="path">/api/comments</span></div>
                </section>
            </div>

            <div class="commands">
                <h2>CLI Command Reference</h2>
                <p style="color: var(--text-muted); margin-bottom: 16px; font-size: 14px;">Essential commands for system maintenance and deployment.</p>
                <code-box>firebase deploy --only hosting,firestore:rules</code-box>
                <code-box>npm run dev:server # Runs bridge API locally</code-box>
                <code-box>stripe listen --forward-to localhost:3000/api/webhook</code-box>
            </div>

            <footer>
                &copy; 2026 ChromaBase CRM Engineering. All rights reserved.
            </footer>
        </div>
    </body>
    </html>
  `);
});

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'ChromaBase API', firestore: !!db }));

// ==================== CLIENTS ====================
app.get('/api/clients', async (req, res) => {
  try {
    const snap = await db.collection('clients').orderBy('createdAt', 'desc').get();
    res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  } catch (e) { res.json(error(e.message)); }
});

app.post('/api/clients', async (req, res) => {
  try {
    const data = { ...req.body, createdAt: Date.now(), updatedAt: Date.now() };
    const doc = await db.collection('clients').add(data);
    res.json(success({ id: doc.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.get('/api/clients/:id', async (req, res) => {
  try {
    const doc = await db.collection('clients').doc(req.params.id).get();
    doc.exists ? res.json(success({ id: doc.id, ...doc.data() })) : res.json(error('Not found'));
  } catch (e) { res.json(error(e.message)); }
});

app.put('/api/clients/:id', async (req, res) => {
  try {
    await db.collection('clients').doc(req.params.id).update({ ...req.body, updatedAt: Date.now() });
    res.json(success({ id: req.params.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.delete('/api/clients/:id', async (req, res) => {
  try {
    await db.collection('clients').doc(req.params.id).delete();
    res.json(success({ deleted: true }));
  } catch (e) { res.json(error(e.message)); }
});

// ==================== LEADS ====================
app.get('/api/leads', async (req, res) => {
  try {
    const snap = await db.collection('leads').orderBy('createdAt', 'desc').get();
    res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  } catch (e) { res.json(error(e.message)); }
});

app.post('/api/leads', async (req, res) => {
  try {
    const data = { ...req.body, createdAt: Date.now(), updatedAt: Date.now() };
    const doc = await db.collection('leads').add(data);
    res.json(success({ id: doc.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.get('/api/leads/:id', async (req, res) => {
  try {
    const doc = await db.collection('leads').doc(req.params.id).get();
    doc.exists ? res.json(success({ id: doc.id, ...doc.data() })) : res.json(error('Not found'));
  } catch (e) { res.json(error(e.message)); }
});

app.put('/api/leads/:id', async (req, res) => {
  try {
    await db.collection('leads').doc(req.params.id).update({ ...req.body, updatedAt: Date.now() });
    res.json(success({ id: req.params.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.delete('/api/leads/:id', async (req, res) => {
  try {
    await db.collection('leads').doc(req.params.id).delete();
    res.json(success({ deleted: true }));
  } catch (e) { res.json(error(e.message)); }
});

// ==================== TASKS ====================
app.get('/api/tasks', async (req, res) => {
  try {
    const snap = await db.collection('tasks').orderBy('dueDate', 'asc').get();
    res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  } catch (e) { res.json(error(e.message)); }
});

// Bulk operations must be defined before /:id routes
app.post('/api/tasks/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) return res.json(error('ids must be an array'));
    if (ids.length === 0) return res.json(success({ deletedCount: 0 }));

    const batch = db.batch();
    ids.forEach(id => {
      batch.delete(db.collection('tasks').doc(id));
    });
    await batch.commit();
    res.json(success({ deletedCount: ids.length }));
  } catch (e) { res.json(error(e.message)); }
});

app.put('/api/tasks/bulk-update', async (req, res) => {
  try {
    const { ids, data } = req.body;
    if (!Array.isArray(ids)) return res.json(error('ids must be an array'));
    if (ids.length === 0) return res.json(success({ updatedCount: 0 }));

    const batch = db.batch();
    const updateData = { ...data, updatedAt: Date.now() };

    // Fetch docs in parallel to check for recurrence
    const docs = await Promise.all(ids.map(id => db.collection('tasks').doc(id).get()));

    ids.forEach((id, index) => {
      const doc = docs[index];
      batch.update(db.collection('tasks').doc(id), updateData);

      if (doc.exists) {
        const existingData = doc.data();
        const isNowCompleted = existingData.status !== 'completed' && data.status === 'completed';

        if (isNowCompleted && existingData.recurrenceRule && existingData.recurrenceRule !== 'none') {
          let addedDays = 1;
          if (existingData.recurrenceRule === 'daily') addedDays = 1;
          else if (existingData.recurrenceRule === 'weekly') addedDays = 7;
          else if (existingData.recurrenceRule === 'monthly') addedDays = 30;

          const nextDueDate = new Date(existingData.dueDate || Date.now());
          nextDueDate.setDate(nextDueDate.getDate() + addedDays);

          const nextTaskRef = db.collection('tasks').doc();
          batch.set(nextTaskRef, {
            ...existingData,
            status: 'todo',
            dueDate: nextDueDate.getTime(),
            createdAt: Date.now(),
            updatedAt: Date.now()
          });
        }
      }
    });

    await batch.commit();
    res.json(success({ updatedCount: ids.length }));
  } catch (e) { res.json(error(e.message)); }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const data = { ...req.body, createdAt: Date.now(), updatedAt: Date.now() };
    const doc = await db.collection('tasks').add(data);
    sendDiscordAlertIfEnabled('task', { id: doc.id, ...data });
    res.json(success({ id: doc.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const doc = await db.collection('tasks').doc(req.params.id).get();
    doc.exists ? res.json(success({ id: doc.id, ...doc.data() })) : res.json(error('Not found'));
  } catch (e) { res.json(error(e.message)); }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const existingDoc = await db.collection('tasks').doc(taskId).get();

    if (!existingDoc.exists) return res.json(error('Not found'));

    const existingData = existingDoc.data();
    const isNowCompleted = existingData.status !== 'completed' && req.body.status === 'completed';

    await db.collection('tasks').doc(taskId).update({ ...req.body, updatedAt: Date.now() });

    // Recurrence Logic
    if (isNowCompleted && existingData.recurrenceRule && existingData.recurrenceRule !== 'none') {
      let addedDays = 1;
      if (existingData.recurrenceRule === 'daily') addedDays = 1;
      else if (existingData.recurrenceRule === 'weekly') addedDays = 7;
      else if (existingData.recurrenceRule === 'monthly') addedDays = 30; // simple approximation

      const nextDueDate = new Date(existingData.dueDate || Date.now());
      nextDueDate.setDate(nextDueDate.getDate() + addedDays);

      const nextTask = {
        ...existingData,
        status: 'todo',
        dueDate: nextDueDate.getTime(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      delete nextTask.id;

      await db.collection('tasks').add(nextTask);
      sendDiscordAlertIfEnabled('task', nextTask);
    }

    sendDiscordAlertIfEnabled('task', { id: taskId, ...existingData, ...req.body });
    res.json(success({ id: taskId }));
  } catch (e) { res.json(error(e.message)); }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await db.collection('tasks').doc(req.params.id).delete();
    res.json(success({ deleted: true }));
  } catch (e) { res.json(error(e.message)); }
});

// ==================== APPOINTMENTS ====================
app.get('/api/appointments', async (req, res) => {
  try {
    const snap = await db.collection('appointments').orderBy('startTime', 'asc').get();
    res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  } catch (e) { res.json(error(e.message)); }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const data = { ...req.body, createdAt: Date.now(), updatedAt: Date.now() };
    const doc = await db.collection('appointments').add(data);
    res.json(success({ id: doc.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.get('/api/appointments/:id', async (req, res) => {
  try {
    const doc = await db.collection('appointments').doc(req.params.id).get();
    doc.exists ? res.json(success({ id: doc.id, ...doc.data() })) : res.json(error('Not found'));
  } catch (e) { res.json(error(e.message)); }
});

app.put('/api/appointments/:id', async (req, res) => {
  try {
    await db.collection('appointments').doc(req.params.id).update({ ...req.body, updatedAt: Date.now() });
    res.json(success({ id: req.params.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    await db.collection('appointments').doc(req.params.id).delete();
    res.json(success({ deleted: true }));
  } catch (e) { res.json(error(e.message)); }
});

// ==================== QUOTES ====================
app.get('/api/quotes', async (req, res) => {
  try {
    const snap = await db.collection('quotes').orderBy('createdAt', 'desc').get();
    res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  } catch (e) { res.json(error(e.message)); }
});

app.post('/api/quotes', async (req, res) => {
  try {
    const data = { ...req.body, createdAt: Date.now(), updatedAt: Date.now() };
    const doc = await db.collection('quotes').add(data);
    res.json(success({ id: doc.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.get('/api/quotes/:id', async (req, res) => {
  try {
    const doc = await db.collection('quotes').doc(req.params.id).get();
    doc.exists ? res.json(success({ id: doc.id, ...doc.data() })) : res.json(error('Not found'));
  } catch (e) { res.json(error(e.message)); }
});

app.put('/api/quotes/:id', async (req, res) => {
  try {
    await db.collection('quotes').doc(req.params.id).update({ ...req.body, updatedAt: Date.now() });
    res.json(success({ id: req.params.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.delete('/api/quotes/:id', async (req, res) => {
  try {
    await db.collection('quotes').doc(req.params.id).delete();
    res.json(success({ deleted: true }));
  } catch (e) { res.json(error(e.message)); }
});

// ==================== ACTIVITIES ====================
app.get('/api/activities', async (req, res) => {
  try {
    const snap = await db.collection('activities').orderBy('timestamp', 'desc').limit(100).get();
    res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  } catch (e) { res.json(error(e.message)); }
});

app.post('/api/activities', async (req, res) => {
  try {
    const data = { ...req.body, timestamp: Date.now(), createdAt: Date.now() };
    const doc = await db.collection('activities').add(data);
    res.json(success({ id: doc.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.delete('/api/activities/:id', async (req, res) => {
  try {
    await db.collection('activities').doc(req.params.id).delete();
    res.json(success({ deleted: true }));
  } catch (e) { res.json(error(e.message)); }
});

// ==================== CAMPAIGNS ====================
app.get('/api/campaigns', async (req, res) => {
  try {
    const snap = await db.collection('campaigns').orderBy('createdAt', 'desc').get();
    res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  } catch (e) { res.json(error(e.message)); }
});

app.post('/api/campaigns', async (req, res) => {
  try {
    const data = { ...req.body, createdAt: Date.now(), updatedAt: Date.now() };
    const doc = await db.collection('campaigns').add(data);
    res.json(success({ id: doc.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.get('/api/campaigns/:id', async (req, res) => {
  try {
    const doc = await db.collection('campaigns').doc(req.params.id).get();
    doc.exists ? res.json(success({ id: doc.id, ...doc.data() })) : res.json(error('Not found'));
  } catch (e) { res.json(error(e.message)); }
});

app.put('/api/campaigns/:id', async (req, res) => {
  try {
    await db.collection('campaigns').doc(req.params.id).update({ ...req.body, updatedAt: Date.now() });
    res.json(success({ id: req.params.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.delete('/api/campaigns/:id', async (req, res) => {
  try {
    await db.collection('campaigns').doc(req.params.id).delete();
    res.json(success({ deleted: true }));
  } catch (e) { res.json(error(e.message)); }
});

// ==================== CONTACTS ====================
app.get('/api/contacts', async (req, res) => {
  try {
    const snap = await db.collection('contacts').orderBy('createdAt', 'desc').get();
    let contacts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (req.query.clientId) {
      contacts = contacts.filter(c => c.clientId === req.query.clientId);
    }
    res.json(success(contacts));
  } catch (e) { res.json(error(e.message)); }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const data = { ...req.body, createdAt: Date.now(), updatedAt: Date.now() };
    const doc = await db.collection('contacts').add(data);
    res.json(success({ id: doc.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.get('/api/contacts/:id', async (req, res) => {
  try {
    const doc = await db.collection('contacts').doc(req.params.id).get();
    doc.exists ? res.json(success({ id: doc.id, ...doc.data() })) : res.json(error('Not found'));
  } catch (e) { res.json(error(e.message)); }
});

app.put('/api/contacts/:id', async (req, res) => {
  try {
    await db.collection('contacts').doc(req.params.id).update({ ...req.body, updatedAt: Date.now() });
    res.json(success({ id: req.params.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    await db.collection('contacts').doc(req.params.id).delete();
    res.json(success({ deleted: true }));
  } catch (e) { res.json(error(e.message)); }
});

// ==================== DEALS ====================
app.get('/api/deals', async (req, res) => {
  try {
    const snap = await db.collection('deals').orderBy('createdAt', 'desc').get();
    res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  } catch (e) { res.json(error(e.message)); }
});

app.post('/api/deals', async (req, res) => {
  try {
    const data = { ...req.body, createdAt: Date.now(), updatedAt: Date.now() };
    const doc = await db.collection('deals').add(data);
    sendDiscordAlertIfEnabled('deal', { id: doc.id, ...data });
    res.json(success({ id: doc.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.get('/api/deals/:id', async (req, res) => {
  try {
    const doc = await db.collection('deals').doc(req.params.id).get();
    doc.exists ? res.json(success({ id: doc.id, ...doc.data() })) : res.json(error('Not found'));
  } catch (e) { res.json(error(e.message)); }
});

app.put('/api/deals/:id', async (req, res) => {
  try {
    const doc = await db.collection('deals').doc(req.params.id).get();
    if (doc.exists) {
      const existingData = doc.data();
      if (req.body.stage && existingData.stage !== req.body.stage) {
        sendDiscordAlertIfEnabled('deal', { id: req.params.id, ...existingData, ...req.body });
      }
    }
    await db.collection('deals').doc(req.params.id).update({ ...req.body, updatedAt: Date.now() });
    res.json(success({ id: req.params.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.delete('/api/deals/:id', async (req, res) => {
  try {
    await db.collection('deals').doc(req.params.id).delete();
    res.json(success({ deleted: true }));
  } catch (e) { res.json(error(e.message)); }
});

// ==================== PROPOSALS ====================
app.get('/api/proposals', async (req, res) => {
  try {
    const snap = await db.collection('proposals').orderBy('createdAt', 'desc').get();
    res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  } catch (e) { res.json(error(e.message)); }
});

app.post('/api/proposals', async (req, res) => {
  try {
    const data = { ...req.body, createdAt: Date.now(), updatedAt: Date.now() };
    const doc = await db.collection('proposals').add(data);
    res.json(success({ id: doc.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.get('/api/proposals/:id', async (req, res) => {
  try {
    const doc = await db.collection('proposals').doc(req.params.id).get();
    doc.exists ? res.json(success({ id: doc.id, ...doc.data() })) : res.json(error('Not found'));
  } catch (e) { res.json(error(e.message)); }
});

app.put('/api/proposals/:id', async (req, res) => {
  try {
    await db.collection('proposals').doc(req.params.id).update({ ...req.body, updatedAt: Date.now() });
    res.json(success({ id: req.params.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.delete('/api/proposals/:id', async (req, res) => {
  try {
    await db.collection('proposals').doc(req.params.id).delete();
    res.json(success({ deleted: true }));
  } catch (e) { res.json(error(e.message)); }
});

// ==================== DISCORD SETTINGS ====================
app.get('/api/settings/discord', async (req, res) => {
  try {
    const doc = await db.collection('settings').doc('discord').get();
    if (!doc.exists) {
      return res.json(success({ webhookUrl: '', options: { highPriorityTasks: false, dealStageChanges: false } }));
    }
    res.json(success(doc.data()));
  } catch (e) { res.json(error(e.message)); }
});

app.post('/api/settings/discord', async (req, res) => {
  try {
    await db.collection('settings').doc('discord').set({ ...req.body, updatedAt: Date.now() });
    res.json(success({ id: 'discord' }));
  } catch (e) { res.json(error(e.message)); }
});

const sendDiscordAlertIfEnabled = async (type, data) => {
  try {
    const doc = await db.collection('settings').doc('discord').get();
    if (!doc.exists) return;
    const settings = doc.data();
    if (!settings.webhookUrl || !settings.webhookUrl.trim()) return;

    let embeds = [];

    if (type === 'task' && settings.options?.highPriorityTasks) {
      if (['high', 'urgent'].includes(data.priority?.toLowerCase()) && data.status !== 'completed') {
        embeds.push({
          title: `🔴 High Priority Task: ${data.title}`,
          color: 16711680,
          description: `Status: ${data.status}\nDue: ${data.dueDate ? new Date(data.dueDate).toLocaleString() : 'N/A'}`
        });
      } else return;
    } else if (type === 'deal' && settings.options?.dealStageChanges) {
      embeds.push({
        title: `🤝 Deal Stage Updated: ${data.name || 'Unknown Deal'}`,
        color: 3447003,
        description: `New Stage: **${data.stage}**\nValue: $${data.value || 0}`
      });
    } else return;

    if (embeds.length > 0) {
      fetch(settings.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '', embeds })
      }).catch(e => console.error('Discord fetch failed:', e.message));
    }
  } catch (e) { console.error('Discord alert error:', e.message); }
};

// ==================== NOTIFICATIONS ====================
app.get('/api/notifications', async (req, res) => {
  try {
    const snap = await db.collection('notifications').orderBy('createdAt', 'desc').get();
    res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  } catch (e) { res.json(error(e.message)); }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const data = { ...req.body, createdAt: Date.now(), read: false };
    const doc = await db.collection('notifications').add(data);
    res.json(success({ id: doc.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.put('/api/notifications/:id', async (req, res) => {
  try {
    await db.collection('notifications').doc(req.params.id).update({ ...req.body, updatedAt: Date.now() });
    res.json(success({ id: req.params.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.delete('/api/notifications/:id', async (req, res) => {
  try {
    await db.collection('notifications').doc(req.params.id).delete();
    res.json(success({ deleted: true }));
  } catch (e) { res.json(error(e.message)); }
});

// ==================== COMMENTS ====================
app.get('/api/comments', async (req, res) => {
  try {
    const snap = await db.collection('comments').orderBy('createdAt', 'asc').get();
    let comments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (req.query.entityId) {
      comments = comments.filter(c => c.entityId === req.query.entityId);
    }
    res.json(success(comments));
  } catch (e) { res.json(error(e.message)); }
});

app.post('/api/comments', async (req, res) => {
  try {
    const data = { ...req.body, createdAt: Date.now() };
    const doc = await db.collection('comments').add(data);
    res.json(success({ id: doc.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.delete('/api/comments/:id', async (req, res) => {
  try {
    await db.collection('comments').doc(req.params.id).delete();
    res.json(success({ deleted: true }));
  } catch (e) { res.json(error(e.message)); }
});

// ==================== DISCORD INTEGRATION ====================
app.post('/api/discord/test', async (req, res) => {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL || req.body.webhookUrl;
    if (!webhookUrl) return res.json(error('No Discord webhook URL provided'));

    const payload = {
      username: "ChromaBase System",
      avatar_url: "https://ui.shadcn.com/favicon.ico",
      embeds: [{
        title: "✅ ChromaBase Integration Successful",
        description: "Your Discord server is now connected to ChromaBase. You will receive automated task reminders and deal alerts here.",
        color: 5814783, // #5865F2 in decimal
        timestamp: new Date().toISOString()
      }]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      res.json(success({ sent: true }));
    } else {
      res.json(error(`Discord API Error: ${response.statusText}`));
    }
  } catch (e) { res.json(error(e.message)); }
});

// ==================== DASHBOARD STATS ====================
app.get('/api/stats', async (req, res) => {
  try {
    const [clients, leads, tasks, quotes] = await Promise.all([
      db.collection('clients').get(),
      db.collection('leads').get(),
      db.collection('tasks').get(),
      db.collection('quotes').get()
    ]);

    const activeLeads = leads.docs.filter(d => d.data().status !== 'won' && d.data().status !== 'lost').length;
    const wonLeads = leads.docs.filter(d => d.data().status === 'won').length;
    const pendingTasks = tasks.docs.filter(d => d.data().status !== 'completed').length;
    const totalRevenue = quotes.docs
      .filter(d => d.data().status === 'accepted')
      .reduce((sum, d) => sum + (d.data().total || 0), 0);

    res.json(success({
      totalClients: clients.size,
      activeLeads,
      wonLeads,
      pendingTasks,
      totalRevenue,
      pendingQuotes: quotes.docs.filter(d => d.data().status === 'sent').length
    }));
  } catch (e) { res.json(error(e.message)); }
});

// ==================== TEAM ====================
app.get('/api/team', async (req, res) => {
  try {
    const snap = await db.collection('team').orderBy('name', 'asc').get();
    res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  } catch (e) { res.json(error(e.message)); }
});

app.post('/api/team', async (req, res) => {
  try {
    const data = { ...req.body, createdAt: Date.now(), updatedAt: Date.now() };
    const doc = await db.collection('team').add(data);
    res.json(success({ id: doc.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.put('/api/team/:id', async (req, res) => {
  try {
    await db.collection('team').doc(req.params.id).update({ ...req.body, updatedAt: Date.now() });
    res.json(success({ id: req.params.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.delete('/api/team/:id', async (req, res) => {
  try {
    await db.collection('team').doc(req.params.id).delete();
    res.json(success({ deleted: true }));
  } catch (e) { res.json(error(e.message)); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 ChromaBase API running on port ${PORT}`));
