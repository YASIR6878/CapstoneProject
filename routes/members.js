const express = require('express');
const Member = require('../models/Member');
const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const { id, name, mobile, email, address } = req.body;

    if (!id || !name || !mobile) {
      return res.status(400).json({ message: 'Please provide id, name, and mobile.' });
    }

    const existingMember = await Member.findOne({ $or: [{ id }, { mobile }] });
    if (existingMember) {
      return res.status(400).json({ message: 'Member with this ID or mobile already exists.' });
    }

    const newMember = new Member({
      id,
      name,
      mobile,
      email,
      address,
    });

    await newMember.save();
    res.json({ message: 'Member added successfully', member: newMember });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const memberId = req.params.id;
    const { name, mobile, email, address } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ message: 'Please provide both name and mobile.' });
    }

    const member = await Member.findOne({ id: memberId });
    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    member.name = name || member.name;
    member.mobile = mobile || member.mobile;
    member.email = email || member.email;
    member.address = address || member.address;

    await member.save();
    res.json({ message: 'Member updated successfully', member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
    try {
      const memberId = req.params.id; 
  
      
      const deletedMember = await Member.findOneAndDelete({ id: memberId });
  
      if (!deletedMember) {
        return res.status(404).json({ message: 'Member not found.' });
      }
  
      res.json({
        message: 'Member deleted successfully',
        member: deletedMember,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  
router.get('/', async (req, res) => {
    try {
      
      const members = await Member.find();
  
      if (members.length === 0) {
        return res.status(404).json({ message: 'No members found.' });
      }
  
      res.json({ members });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  

module.exports = router;
