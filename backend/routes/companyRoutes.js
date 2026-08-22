const express = require('express');
const router = express.Router();

const {createCompany,editCompany,getCompanyById,deleteCompany,getAllCompany}=require('../controllers/companyController')
const { auth } = require('../middleware/authMiddleware');

router.post("/create",auth,createCompany);
router.get("/my-company",auth,getAllCompany);
router.put("/:companyId/edit",auth,editCompany);
router.get("/:companyId",getCompanyById);
router.delete("/delete/:companyId",auth,deleteCompany);

module.exports=router;

