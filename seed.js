require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./api/models/Product');

const products = [
  { id:1, name:'10% Vita-C Face Serum 30ml', category:'serums', price:299, mrp:499, badge:'Bestseller', icon:'✨', bg:'#F0E4D8', desc:'For Hyperpigmentation & Dull Skin', fullDesc:'Aqua, 3-O-Ethyl Ascorbic Acid, Butylene Glycol...', rating:4.8, reviews:120, tags:['brightening','serum','vitamin-c'], skin:'All skin types', size:'30ml' },
  { id:2, name:'Niacinamide Face Serum 30ml', category:'serum', price:299, mrp:499, badge:'Bestseller', icon:'💧', bg:'#D8E0D4', desc:'For Hyperpigmentation & Dull Skin', fullDesc:'Aqua, Niacinamide, Propanediol, Butylene Glycol...', rating:4.8, reviews:80, tags:['brightening','serum','niacinamide'], skin:'All skin types', size:'30ml' },
  { id:3, name:'2% Salicylic Acid Face Serum 30ml', category:'serum', price:299, mrp:499, badge:'New', icon:'💧', bg:'#D8E0D4', desc:'For Acne & Blemishes', fullDesc:'Aqua, Pentylene Glycol, Salicylic Acid...', rating:4.8, reviews:80, tags:['acne','serum','salicylic-acid'], skin:'All skin types', size:'30ml' },
  { id:4, name:'Spot Removal Face Serum 30ml', category:'serum', price:299, mrp:499, badge:'New', icon:'💧', bg:'#D8E0D4', desc:'For Dark Spots', fullDesc:'Aqua, Niacinamide, 3-O-Ethyl Ascorbic Acid...', rating:4.8, reviews:80, tags:['brightening','serum','dark-spots'], skin:'All skin types', size:'30ml' },
  { id:5, name:'Rosemary Hair Serum 30ml', category:'serum', price:299, mrp:499, badge:'New', icon:'💧', bg:'#D8E0D4', desc:'For Hair Growth', fullDesc:'Aqua, Rosmarinus Officinalis Leaf Extract...', rating:4.8, reviews:80, tags:['hair','serum','rosemary'], skin:'All skin types', size:'30ml' },
  { id:6, name:'Moisturizer Cream 50gm', category:'Cream', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Daily Moisturizer', fullDesc:'Aqua, Caprylic/Capric Triglyceride...', rating:4.8, reviews:80, tags:['moisturizer','cream'], skin:'All skin types', size:'50gm' },
  { id:7, name:'Night Cream 50gm', category:'Cream', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Night Repair Cream', fullDesc:'Aqua, Butylene Glycol, Shea Butter...', rating:4.8, reviews:80, tags:['night','cream','repair'], skin:'All skin types', size:'50gm' },
  { id:8, name:'Retinol Cream 50gm', category:'Cream', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Anti-Aging Cream', fullDesc:'Aqua, Niacinamide, Retinol...', rating:4.8, reviews:80, tags:['retinol','anti-aging','cream'], skin:'All skin types', size:'50gm' },
  { id:9, name:'Skin Lightening Cream 50gm', category:'Cream', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Brightening Cream', fullDesc:'Aqua, Shea Butter, Niacinamide...', rating:4.8, reviews:80, tags:['brightening','cream'], skin:'All skin types', size:'50gm' },
  { id:10, name:'SPF 30 Cream 50gm', category:'Cream', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Sunscreen Cream SPF 30', fullDesc:'Aqua, Octyl Methoxycinnamate...', rating:4.8, reviews:80, tags:['spf','sunscreen','cream'], skin:'All skin types', size:'50gm' },
  { id:11, name:'Ubtan Cream 50gm', category:'Cream', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Traditional Ubtan Cream', fullDesc:'Aqua, Shea Butter, Turmeric...', rating:4.8, reviews:80, tags:['ubtan','cream','traditional'], skin:'All skin types', size:'50gm' },
  { id:12, name:'Sunscreen SPF 50', category:'Commodity Product', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'High Protection Sunscreen SPF 50', fullDesc:'Aqua, Octyl Methoxycinnamate...', rating:4.8, reviews:80, tags:['spf50','sunscreen'], skin:'All skin types', size:'50gm' },
  { id:13, name:'Kojic Acid Cream', category:'Commodity Product', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Kojic Acid Brightening Cream', fullDesc:'Aqua, Shea Butter, Kojic Acid...', rating:4.8, reviews:80, tags:['kojic-acid','brightening'], skin:'All skin types', size:'50gm' },
  { id:14, name:'Wax Powder', category:'Commodity Product', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Hair Removal Wax Powder', fullDesc:'Bentonite, Starch, Urea...', rating:4.8, reviews:80, tags:['wax','hair-removal'], skin:'All skin types', size:'50gm' },
  { id:15, name:'Rosemary Conditioner', category:'Conditioner', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Rosemary Hair Conditioner', fullDesc:'Aqua, Cetostearyl Alcohol...', rating:4.8, reviews:80, tags:['conditioner','rosemary','hair'], skin:'All skin types', size:'30ml' },
  { id:16, name:'Rice Water Conditioner', category:'Conditioner', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Rice Water Conditioner', fullDesc:'Aqua, Cetostearyl Alcohol, Rice Water...', rating:4.8, reviews:80, tags:['conditioner','rice-water','hair'], skin:'All skin types', size:'30ml' },
  { id:17, name:'Anti Dandruff Conditioner', category:'Conditioner', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Anti Dandruff Conditioner', fullDesc:'Aqua, Cetostearyl Alcohol, Neem...', rating:4.8, reviews:80, tags:['conditioner','dandruff','hair'], skin:'All skin types', size:'30ml' },
  { id:18, name:'Damage Repair Conditioner', category:'Conditioner', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Damage Repair Conditioner', fullDesc:'Aqua, Cetostearyl Alcohol, Almond Oil...', rating:4.8, reviews:80, tags:['conditioner','damage-repair','hair'], skin:'All skin types', size:'30ml' },
  { id:19, name:'7 in 1 Repair Conditioner', category:'Conditioner', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'7 in 1 Complete Repair Conditioner', fullDesc:'Aqua, Nigella Sativa Oil...', rating:4.8, reviews:80, tags:['conditioner','7-in-1','repair','hair'], skin:'All skin types', size:'30ml' },
  { id:20, name:'Salicylic Acid Face Wash (With Applicator)', category:'Face Wash', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Salicylic Acid Face Wash', fullDesc:'Aqua, Sodium Lauroyl Sarcosinate...', rating:4.8, reviews:80, tags:['face-wash','salicylic-acid','acne'], skin:'All skin types', size:'30ml' },
  { id:21, name:'Skin Brightening Face Wash (With Applicator)', category:'Face Wash', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Brightening Face Wash', fullDesc:'Aqua, Cocoamidopropyl Betaine...', rating:4.8, reviews:80, tags:['face-wash','brightening'], skin:'All skin types', size:'30ml' },
  { id:22, name:'Green Tea Face Wash (With Applicator)', category:'Face Wash', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Green Tea Face Wash', fullDesc:'Aqua, Sodium Lauryl Sarcosinate...', rating:4.8, reviews:80, tags:['face-wash','green-tea','antioxidant'], skin:'All skin types', size:'30ml' },
  { id:23, name:'Salicylic Acid Face Wash 100ml', category:'Face Wash', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Salicylic Acid Face Wash 100ml', fullDesc:'Aqua, Sodium Lauroyl Sarcosinate...', rating:4.8, reviews:80, tags:['face-wash','salicylic-acid','acne'], skin:'All skin types', size:'100ml' },
  { id:24, name:'Skin Brightening Face Wash 100ml', category:'Face Wash', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Brightening Face Wash 100ml', fullDesc:'Aqua, Cocoamidopropyl Betaine...', rating:4.8, reviews:80, tags:['face-wash','brightening'], skin:'All skin types', size:'100ml' },
  { id:25, name:'Green Tea Face Wash 100ml', category:'Face Wash', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Green Tea Face Wash 100ml', fullDesc:'Aqua, Acrylates Copolymer...', rating:4.8, reviews:80, tags:['face-wash','green-tea'], skin:'All skin types', size:'100ml' },
  { id:26, name:'Rosemary Shampoo 200ml', category:'Shampoo', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Rosemary Hair Shampoo', fullDesc:'Aqua, Sodium Lauryl Sarcosinate...', rating:4.8, reviews:80, tags:['shampoo','rosemary','hair'], skin:'All skin types', size:'200ml' },
  { id:27, name:'Rice Water Shampoo 200ml', category:'Shampoo', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Rice Water Shampoo', fullDesc:'Aqua, Rice Water...', rating:4.8, reviews:80, tags:['shampoo','rice-water','hair'], skin:'All skin types', size:'200ml' },
  { id:28, name:'Anti Dandruff Shampoo 200ml', category:'Shampoo', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Anti Dandruff Shampoo', fullDesc:'Aqua, Sodium Laureth Sulphate...', rating:4.8, reviews:80, tags:['shampoo','dandruff','hair'], skin:'All skin types', size:'200ml' },
  { id:29, name:'Damage Repair Shampoo 200ml', category:'Shampoo', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'Damage Repair Shampoo', fullDesc:'Aqua, Linseed Extract...', rating:4.8, reviews:80, tags:['shampoo','damage-repair','hair'], skin:'All skin types', size:'200ml' },
  { id:30, name:'7 in 1 Repair Shampoo 200ml', category:'Shampoo', price:299, mrp:499, badge:'', icon:'🌤️', bg:'#F0E8D8', desc:'7 in 1 Complete Repair Shampoo', fullDesc:'Aqua, Sodium Lauryl Sarcosinate...', rating:4.8, reviews:80, tags:['shampoo','7-in-1','repair','hair'], skin:'All skin types', size:'200ml' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);

    await mongoose.disconnect();
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
