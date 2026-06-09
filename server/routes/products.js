const express = require('express');
const router = express.Router();

// Products are served from the static data.js for now.
// The frontend already has all product data.
// These endpoints can be used for future dynamic product management.

const PRODUCTS = [
  { id:1, name:'10% Vita-C Face Serum 30ml', category:'serums', price:299, mrp:499, badge:'Bestseller', icon:'✨', bg:'#F0E4D8', desc:'For Hyperpigmentation & Dull Skin', rating:4.8, reviews:120, tags:['brightening','serum','vitamin-c'], skin:'All skin types', size:'30ml' },
  { id:2, name:'Niacinamide Face Serum 30ml', category:'serum', price:299, mrp:499, badge:'Bestseller', icon:'💧', bg:'#D8E0D4', desc:'For Hyperpigmentation & Dull Skin', rating:4.8, reviews:80, tags:['brightening','serum','vitamin-c'], skin:'All skin types', size:'30ml' },
  { id:3, name:'2% Salicylic Acid Face Serum 30ml', category:'serum', price:299, mrp:499, badge:'New', icon:'💧', bg:'#D8E0D4', desc:'For Hyperpigmentation & Dull Skin', rating:4.8, reviews:80, tags:['brightening','serum','vitamin-c'], skin:'All skin types', size:'30ml' },
  { id:4, name:'Spot Removal Face Serum 30ml', category:'serum', price:299, mrp:499, badge:'New', icon:'💧', bg:'#D8E0D4', desc:'For Hyperpigmentation & Dull Skin', rating:4.8, reviews:80, tags:['brightening','serum','vitamin-c'], skin:'All skin types', size:'30ml' },
  { id:5, name:'Rosemary Hair Serum 30ml', category:'serum', price:299, mrp:499, badge:'New', icon:'💧', bg:'#D8E0D4', desc:'For Hyperpigmentation & Dull Skin', rating:4.8, reviews:80, tags:['brightening','serum','vitamin-c'], skin:'All skin types', size:'30ml' },
  { id:6, name:'Moisturizer Cream 50gm', category:'Cream', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Moisturizer Cream', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'50gm' },
  { id:7, name:'Night Cream 50gm', category:'Cream', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Night Cream', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'50gm' },
  { id:8, name:'Retinol Cream 50gm', category:'Cream', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Retinol Cream', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'50gm' },
  { id:9, name:'Skin Lightening Cream 50gm', category:'Cream', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Skin Lightening Cream', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'50gm' },
  { id:10, name:'SPF 30 Cream 50gm', category:'Cream', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'SPF 30 Cream', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'50gm' },
  { id:11, name:'Ubtan Cream 50gm', category:'Cream', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Ubtan Cream', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'50gm' },
  { id:12, name:'Sunscreen SPF 50', category:'Commodity Product', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Sunscreen SPF 50', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'50gm' },
  { id:13, name:'Kojic Acid Cream', category:'Commodity Product', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Kojic Acid Cream', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'50gm' },
  { id:14, name:'Wax Powder', category:'Commodity Product', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Wax Powder', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'50gm' },
  { id:15, name:'Rosemary Conditioner', category:'Conditioner', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Rosemary Conditioner', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'30ml' },
  { id:16, name:'Rice Water Conditioner', category:'Conditioner', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Rice Water Conditioner', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'30ml' },
  { id:17, name:'Anti Dandruff Conditioner', category:'Conditioner', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Anti Dandruff Conditioner', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'30ml' },
  { id:18, name:'Damage Repair Conditioner', category:'Conditioner', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Damage Repair Conditioner', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'30ml' },
  { id:19, name:'7 in 1 Repair Conditioner', category:'Conditioner', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'7 in 1 Repair Conditioner', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'30ml' },
  { id:20, name:'Salicylic Acid Face Wash (With Applicator)', category:'Face Wash', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Salicylic Acid Face Wash', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'30ml' },
  { id:21, name:'Skin Brightening Face Wash (With Applicator)', category:'Face Wash', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Skin Brightening Face Wash', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'30ml' },
  { id:22, name:'Green Tea Face Wash (With Applicator)', category:'Face Wash', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Green Tea Face Wash', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'30ml' },
  { id:23, name:'Salicylic Acid Face Wash 100ml', category:'Face Wash', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Salicylic Acid Face Wash', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'30ml' },
  { id:24, name:'Skin Brightening Face Wash 100ml', category:'Face Wash', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Skin Brightening Face Wash', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'30ml' },
  { id:25, name:'Green Tea Face Wash 100ml', category:'Face Wash', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Green Tea Face Wash', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'30ml' },
  { id:26, name:'Rosemary Shampoo 200ml', category:'Shampoo', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Rosemary Shampoo', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'30ml' },
  { id:27, name:'Rice Water Shampoo 200ml', category:'Shampoo', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Rice Water Shampoo', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'30ml' },
  { id:28, name:'Anti Dandruff Shampoo 200ml', category:'Shampoo', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Anti Dandruff Shampoo', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'30ml' },
  { id:29, name:'Damage Repair Shampoo 200ml', category:'Shampoo', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Damage Repair Shampoo', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'30ml' },
  { id:30, name:'7 in 1 Repair Shampoo 200ml', category:'Shampoo', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'7 in 1 Repair Shampoo', rating:4.8, reviews:80, tags:[], skin:'All skin types', size:'200ml' }
];

router.get('/', (req, res) => {
  res.json({ products: PRODUCTS });
});

router.get('/:id', (req, res) => {
  const product = PRODUCTS.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

module.exports = router;
