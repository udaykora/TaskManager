const express = require('express');
const router = express.Router();
const { db, FieldValue } = require('../config/firebaseAdmin');
const authMiddleware = require('../middleware/authMiddleware');


router.use(authMiddleware);


router.post('/', async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const taskRef = db.collection('Users').doc(req.uid).collection('Tasks').doc();

    const newTask = {
      title,
      description: description || '',
      dueDate: dueDate || null,
      priority: priority || 'Medium',
      status: status || 'To Do',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await taskRef.set(newTask);

    res.status(201).json({ id: taskRef.id, ...newTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ ALL (frontend filters status/priority itself)
router.get('/', async (req, res) => {
  try {
    const snapshot = await db
      .collection('Users')
      .doc(req.uid)
      .collection('Tasks')
      .orderBy('createdAt', 'desc')
      .get();

    const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, priority, status } = req.body;

  try {
    const taskRef = db.collection('Users').doc(req.uid).collection('Tasks').doc(id);
    const doc = await taskRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedFields = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(dueDate !== undefined && { dueDate }),
      ...(priority !== undefined && { priority }),
      ...(status !== undefined && { status }),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await taskRef.update(updatedFields);

    const updatedDoc = await taskRef.get();
    res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const taskRef = db.collection('Users').doc(req.uid).collection('Tasks').doc(id);
    const doc = await taskRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await taskRef.delete();
    res.status(200).json({ message: 'Task deleted', id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;