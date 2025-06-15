// rentalBackend.js
// A basic Express.js backend for the RentalContract smart contract

const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Blockchain setup
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const rentalContractABI = require('./RentalContractABI.json');
const rentalContractAddress = process.env.CONTRACT_ADDRESS;
const rentalContract = new ethers.Contract(rentalContractAddress, rentalContractABI, wallet);

// ROUTES

// Create a lease
app.post('/lease/create', async (req, res) => {
  try {
    const { tenant, rentAmount, durationMonths } = req.body;
    const tx = await rentalContract.createLease(tenant, rentAmount, durationMonths);
    await tx.wait();
    res.json({ message: 'Lease created', txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sign lease
app.post('/lease/sign', async (req, res) => {
  try {
    const { leaseId } = req.body;
    const tx = await rentalContract.signLease(leaseId);
    await tx.wait();
    res.json({ message: 'Lease signed', txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pay rent
app.post('/lease/pay', async (req, res) => {
  try {
    const { leaseId, rentAmount } = req.body;
    const tx = await rentalContract.payRent(leaseId, { value: ethers.utils.parseEther(rentAmount) });
    await tx.wait();
    res.json({ message: 'Rent paid', txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Terminate lease
app.post('/lease/terminate', async (req, res) => {
  try {
    const { leaseId } = req.body;
    const tx = await rentalContract.terminateLease(leaseId);
    await tx.wait();
    res.json({ message: 'Lease terminated', txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Raise dispute
app.post('/lease/dispute', async (req, res) => {
  try {
    const { leaseId } = req.body;
    const tx = await rentalContract.raiseDispute(leaseId);
    await tx.wait();
    res.json({ message: 'Dispute raised', txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resolve dispute (admin only)
app.post('/lease/resolve', async (req, res) => {
  try {
    const { leaseId } = req.body;
    const tx = await rentalContract.resolveDispute(leaseId);
    await tx.wait();
    res.json({ message: 'Dispute resolved', txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get reputation
app.get('/lease/reputation/:leaseId', async (req, res) => {
  try {
    const leaseId = req.params.leaseId;
    const rep = await rentalContract.getReputation(leaseId);
    res.json({ reputation: rep.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tenant leases
app.get('/tenant/leases/:tenant', async (req, res) => {
  try {
    const leases = await rentalContract.getTenantLeases(req.params.tenant);
    res.json({ leases });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get lease details
app.get('/lease/details/:leaseId', async (req, res) => {
  try {
    const lease = await rentalContract.getLeaseDetails(req.params.leaseId);
    res.json({ lease });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
