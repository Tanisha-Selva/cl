
const express = require("express");
const app = express();

app.use(express.json());

// Change these records according to the question
let records = [
    { id: 1, name: "Arun", category: "IT" },
    { id: 2, name: "Priya", category: "CSE" }
];

// GET - View all records
app.get("/records", (req, res) => {
    res.json(records);
});

// GET - View one record by ID
app.get("/records/:id", (req, res) => {
    const record = records.find(r => r.id == req.params.id);

    if (!record)
        return res.status(404).json({ message: "Record not found" });

    res.json(record);
});

// POST - Add a new record
app.post("/records", (req, res) => {
    records.push(req.body);

    res.status(201).json({
        message: "Record added",
        data: req.body
    });
});

// PUT - Update a record by ID
app.put("/records/:id", (req, res) => {
    const record = records.find(r => r.id == req.params.id);

    if (!record)
        return res.status(404).json({ message: "Record not found" });

    Object.assign(record, req.body);

    res.json({
        message: "Record updated",
        data: record
    });
});

// DELETE - Delete a record by ID
app.delete("/records/:id", (req, res) => {
    const oldLength = records.length;

    records = records.filter(r => r.id != req.params.id);

    if (records.length == oldLength)
        return res.status(404).json({ message: "Record not found" });

    res.json({
        message: "Record deleted",
        records: records
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
