const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const {connection} = require('./configdb');

const app = express();

// Set up middleware
app.use(bodyParser.json());
app.use(cors());

// Get welcome
app.get('/', (req, res) => {
    res.send(`
        <h1>API TODO (Vũ Văn Nghĩa 20206205)</h1>
        <hr>
        <table>
        <tr> <th>Method</th> <th>Description</th> <th>Link</th> </tr>
        <tr> <td>GET</td> <td>Welcome</td> <td><a href='/'>'/'</a></td></tr>
        <tr> <td>GET</td> <td>Get all jobs</td> <td><a href='/api/get_all_jobs'>'/api/get_all_jobs'</a></td></tr>
        <tr> <td>GET</td> <td>GET job by ID</td> <td><a href='/api/get_job_by_id/:id'>'/api/get_job_by_id/:id'</a></td></tr>
        <tr> <td>DELETE</td> <td>Delete job by ID</td> <td><a href='/api/delete_job_by_id/:id'>'/api/delete_job_by_id/:id'</a></td></tr>
        <tr> <td>POST</td> <td>Add new job</td> <td><a href='/api/add_new_job'>'/api/add_new_job'</a></td></tr>
        <tr> <td>PUT</td> <td>Edit job by ID</td> <td><a href='/api/edit_job_by_id/:id'>'/api/edit_job_by_id/:id'</a></td></tr>
        </table>
        <hr>
    `);
});

// Get all jobs
app.get('/api/get_all_jobs', (req, res) => {
    const sql = 'SELECT * FROM job';
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get job by ID
app.get('/api/get_job_by_id/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM job WHERE id = ${id}`;
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// Delete job by ID
app.delete('/api/delete_job_by_id/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM job WHERE id = ${id}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.json({ id });
    });
});

// Add new job
app.post('/api/add_new_job', (req, res) => {
    const { name } = req.body;
    const sql = `SELECT IFNULL(MAX(id), 0) + 1 AS new_id FROM job;`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        const newId = result[0].new_id;
        const insertSql = `INSERT INTO job (id, name, time) VALUES (${newId}, '${name}', NOW())`;
        connection.query(insertSql, (err, result) => {
            if (err) throw err;
            res.json({ id: newId, name, time: new Date().toISOString() });
        });
    });
});

// Edit job by ID
app.put('/api/edit_job_by_id/:id', (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    const sql = `UPDATE job SET name = '${name}', time = NOW() WHERE id = ${id}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.json({ id, name, time: new Date().toISOString() });
    });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));