const Brand=require('../models/brand');

const createBrand=async(req,res)=>{
    try{
        const {name,industry}=req.body;
        const brand=await Brand.create({
            userid:req.user._id,
            name,
            industry
        });
        res.status(201).json(brand);
    }catch(error){
        res.status(400).json({ message: error.message });
    }
};

const getBrands=async(req,res)=>{
    try{
        const brands=await Brand.find().populate('userid','name email');
        res.json(brands);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

const getBrandById=async(req,res)=>{
    try{
        const brand=await Brand.findById(req.params.id).populate('userid','name email');
        if(!brand) return res.status(404).json({ message: 'Brand not found' });
        res.json(brand);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

const updateBrand=async(req,res)=>{
    try{
        const brand=await Brand.findById(req.params.id);
        if(!brand) return res.status(404).json({ message: 'Brand not found' });
        Object.assign(brand,req.body);
        await brand.save();
        res.json(brand);
    }catch(error){
        res.status(400).json({ message: error.message });
    }
};

const deleteBrand = async (req, res) => {
    try {
      const brand = await Brand.findById(req.params.id);
      if (!brand) return res.status(404).json({ message: 'Brand not found' });
  
      await brand.deleteOne();
      res.json({ message: 'Brand deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
module.exports = {
    createBrand,
    getBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
};