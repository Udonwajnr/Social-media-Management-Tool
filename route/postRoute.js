const express = require('express');
const router = express.Router();
const {postScheduling} = require("../controller/postController")

router.get("/",postScheduling)
module.exports = router;