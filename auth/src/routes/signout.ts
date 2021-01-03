import express from 'express';

const router = express.Router();

// Empty out cookie out of session
router.post('/api/users/signout', (req, res) => {
    req.session = null;
    res.send({});
});


export {router as signOutRouter};