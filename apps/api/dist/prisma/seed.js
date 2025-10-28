"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Clothing', slug: 'clothing' },
    { name: 'Food & Groceries', slug: 'food-groceries' },
    { name: 'Home & Garden', slug: 'home-garden' },
    { name: 'Health & Beauty', slug: 'health-beauty' },
    { name: 'Automotive', slug: 'automotive' },
    { name: 'Books & Media', slug: 'books-media' },
    { name: 'Sports & Outdoors', slug: 'sports-outdoors' },
    { name: 'Toys & Games', slug: 'toys-games' },
    { name: 'Jewelry', slug: 'jewelry' }
];
const products = [
    {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Latest flagship smartphone with advanced camera system',
        category: 'Electronics',
        unitType: 'PIECE',
        price: 4500000,
        stock: 25,
        images: ['https://images.samsung.com/is/image/samsung/p6pim/pk/sm-s928bzkdmea/gallery/pk-galaxy-s24-ultra-sm-s928-481001-sm-s928bzkdmea-537866123?$650_519_PNG$'],
        specifications: {
            'Display': '6.8" Dynamic AMOLED 2X',
            'Processor': 'Snapdragon 8 Gen 3',
            'Storage': '256GB',
            'RAM': '12GB',
            'Camera': '200MP Main + 50MP Periscope + 10MP Telephoto',
            'Battery': '5000mAh'
        }
    },
    {
        name: 'MacBook Pro 16-inch M3',
        slug: 'macbook-pro-16-m3',
        description: 'Professional laptop with M3 chip for creators',
        category: 'Electronics',
        unitType: 'PIECE',
        price: 12000000,
        stock: 15,
        images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697230830200'],
        specifications: {
            'Chip': 'Apple M3 Pro',
            'Memory': '18GB unified memory',
            'Storage': '512GB SSD',
            'Display': '16.2-inch Liquid Retina XDR',
            'Graphics': '18-core GPU'
        }
    },
    {
        name: 'Sony WH-1000XM5 Headphones',
        slug: 'sony-wh-1000xm5-headphones',
        description: 'Industry-leading noise canceling wireless headphones',
        category: 'Electronics',
        unitType: 'PIECE',
        price: 850000,
        stock: 30,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Noise Canceling': 'Industry-leading',
            'Battery Life': '30 hours',
            'Quick Charge': '3 min = 3 hours',
            'Driver Unit': '30mm dynamic',
            'Frequency Response': '4Hz-40kHz'
        }
    },
    {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'Latest iPhone with titanium design and A17 Pro chip',
        category: 'Electronics',
        unitType: 'PIECE',
        price: 5500000,
        stock: 35,
        images: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009279822'],
        specifications: {
            'Chip': 'A17 Pro',
            'Display': '6.1" Super Retina XDR',
            'Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
            'Storage': '128GB',
            'Material': 'Titanium'
        }
    },
    {
        name: 'Men\'s Cotton T-Shirt',
        slug: 'mens-cotton-tshirt',
        description: 'Comfortable 100% cotton t-shirt in various colors',
        category: 'Clothing',
        unitType: 'PIECE',
        price: 45000,
        stock: 100,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Material': '100% Cotton',
            'Fit': 'Regular',
            'Care': 'Machine washable',
            'Colors': 'Black, White, Navy, Gray',
            'Sizes': 'S, M, L, XL, XXL'
        }
    },
    {
        name: 'Women\'s Summer Dress',
        slug: 'womens-summer-dress',
        description: 'Elegant floral summer dress perfect for any occasion',
        category: 'Clothing',
        unitType: 'PIECE',
        price: 120000,
        stock: 50,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Material': 'Polyester blend',
            'Style': 'A-line',
            'Length': 'Knee-length',
            'Pattern': 'Floral',
            'Sizes': 'XS, S, M, L, XL'
        }
    },
    {
        name: 'Denim Jeans',
        slug: 'denim-jeans',
        description: 'Classic blue denim jeans with modern fit',
        category: 'Clothing',
        unitType: 'PIECE',
        price: 180000,
        stock: 75,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Material': '98% Cotton, 2% Elastane',
            'Fit': 'Slim',
            'Wash': 'Medium blue',
            'Rise': 'Mid-rise',
            'Sizes': '28-40'
        }
    },
    {
        name: 'Organic Honey',
        slug: 'organic-honey',
        description: 'Pure organic honey from Ethiopian highlands',
        category: 'Food & Groceries',
        unitType: 'KG',
        price: 35000,
        stock: 200,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Type': 'Wildflower honey',
            'Origin': 'Ethiopian highlands',
            'Certification': 'Organic',
            'Weight': '500g jar',
            'Shelf Life': '2 years'
        }
    },
    {
        name: 'Coffee Beans - Yirgacheffe',
        slug: 'coffee-beans-yirgacheffe',
        description: 'Premium Ethiopian coffee beans, single origin',
        category: 'Food & Groceries',
        unitType: 'KG',
        price: 28000,
        stock: 150,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Origin': 'Yirgacheffe, Ethiopia',
            'Process': 'Washed',
            'Roast': 'Medium',
            'Flavor': 'Floral, citrus, bright acidity',
            'Weight': '250g bag'
        }
    },
    {
        name: 'Teff Flour',
        slug: 'teff-flour',
        description: 'Traditional Ethiopian teff flour for injera',
        category: 'Food & Groceries',
        unitType: 'KG',
        price: 12000,
        stock: 300,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Type': 'White teff',
            'Origin': 'Ethiopia',
            'Gluten-free': 'Yes',
            'Protein': 'High',
            'Weight': '1kg bag'
        }
    },
    {
        name: 'LED Desk Lamp',
        slug: 'led-desk-lamp',
        description: 'Adjustable LED desk lamp with USB charging port',
        category: 'Home & Garden',
        unitType: 'PIECE',
        price: 120000,
        stock: 40,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Light Source': 'LED',
            'Brightness': 'Adjustable',
            'Color Temperature': '3000K-6500K',
            'USB Port': 'Yes',
            'Power': 'USB-C charging'
        }
    },
    {
        name: 'Garden Tools Set',
        slug: 'garden-tools-set',
        description: 'Complete set of essential gardening tools',
        category: 'Home & Garden',
        unitType: 'PIECE',
        price: 250000,
        stock: 25,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Tools': 'Spade, rake, hoe, pruners, gloves',
            'Material': 'Stainless steel',
            'Handle': 'Wooden',
            'Storage': 'Canvas bag included',
            'Warranty': '1 year'
        }
    },
    {
        name: 'Shea Butter Cream',
        slug: 'shea-butter-cream',
        description: 'Natural shea butter moisturizing cream',
        category: 'Health & Beauty',
        unitType: 'PIECE',
        price: 45000,
        stock: 80,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Ingredients': '100% natural shea butter',
            'Skin Type': 'All skin types',
            'Size': '200ml jar',
            'Fragrance': 'Unscented',
            'Origin': 'West Africa'
        }
    },
    {
        name: 'Vitamin C Serum',
        slug: 'vitamin-c-serum',
        description: 'Brightening vitamin C serum for face',
        category: 'Health & Beauty',
        unitType: 'PIECE',
        price: 180000,
        stock: 60,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Vitamin C': '20%',
            'Skin Type': 'All skin types',
            'Size': '30ml',
            'Benefits': 'Brightening, anti-aging',
            'Usage': 'Daily'
        }
    },
    {
        name: 'Car Phone Mount',
        slug: 'car-phone-mount',
        description: 'Magnetic car phone mount with wireless charging',
        category: 'Automotive',
        unitType: 'PIECE',
        price: 85000,
        stock: 45,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Mounting': 'Dashboard/vent',
            'Charging': 'Wireless',
            'Compatibility': 'All smartphones',
            'Material': 'ABS plastic',
            'Warranty': '1 year'
        }
    },
    {
        name: 'Car Air Freshener',
        slug: 'car-air-freshener',
        description: 'Long-lasting car air freshener in various scents',
        category: 'Automotive',
        unitType: 'PIECE',
        price: 12000,
        stock: 100,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Duration': '30 days',
            'Scents': 'Vanilla, lavender, citrus',
            'Type': 'Gel-based',
            'Size': '50g',
            'Pack': '3 pieces'
        }
    },
    {
        name: 'Programming Book - JavaScript',
        slug: 'programming-book-javascript',
        description: 'Complete guide to modern JavaScript development',
        category: 'Books & Media',
        unitType: 'PIECE',
        price: 250000,
        stock: 30,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Language': 'English',
            'Pages': '450',
            'Format': 'Paperback',
            'Level': 'Intermediate',
            'Publisher': 'O\'Reilly'
        }
    },
    {
        name: 'Bluetooth Speaker',
        slug: 'bluetooth-speaker',
        description: 'Portable Bluetooth speaker with deep bass',
        category: 'Books & Media',
        unitType: 'PIECE',
        price: 320000,
        stock: 25,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Connectivity': 'Bluetooth 5.0',
            'Battery': '12 hours',
            'Waterproof': 'IPX7',
            'Drivers': '2x 40mm',
            'Range': '30 meters'
        }
    },
    {
        name: 'Yoga Mat',
        slug: 'yoga-mat',
        description: 'Non-slip yoga mat for exercise and meditation',
        category: 'Sports & Outdoors',
        unitType: 'PIECE',
        price: 180000,
        stock: 50,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Material': 'TPE',
            'Thickness': '6mm',
            'Size': '183cm x 61cm',
            'Weight': '1.2kg',
            'Colors': 'Purple, blue, pink'
        }
    },
    {
        name: 'Running Shoes',
        slug: 'running-shoes',
        description: 'Lightweight running shoes for daily training',
        category: 'Sports & Outdoors',
        unitType: 'PIECE',
        price: 450000,
        stock: 40,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Type': 'Running',
            'Cushioning': 'Responsive',
            'Weight': '280g',
            'Sizes': '6-12',
            'Colors': 'Black, white, blue'
        }
    },
    {
        name: 'Educational Building Blocks',
        slug: 'educational-building-blocks',
        description: 'Colorful building blocks for children\'s development',
        category: 'Toys & Games',
        unitType: 'PIECE',
        price: 120000,
        stock: 35,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Age': '3+ years',
            'Pieces': '100',
            'Material': 'Non-toxic plastic',
            'Colors': 'Multi-color',
            'Educational': 'STEM learning'
        }
    },
    {
        name: 'Board Game - Monopoly',
        slug: 'board-game-monopoly',
        description: 'Classic Monopoly board game for family fun',
        category: 'Toys & Games',
        unitType: 'PIECE',
        price: 280000,
        stock: 20,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Players': '2-8',
            'Age': '8+ years',
            'Duration': '60-180 minutes',
            'Language': 'English',
            'Components': 'Board, tokens, cards, money'
        }
    },
    {
        name: 'Silver Necklace',
        slug: 'silver-necklace',
        description: 'Elegant sterling silver necklace with pendant',
        category: 'Jewelry',
        unitType: 'PIECE',
        price: 350000,
        stock: 15,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Material': 'Sterling silver',
            'Chain Length': '45cm',
            'Pendant': 'Heart-shaped',
            'Finish': 'Polished',
            'Packaging': 'Gift box included'
        }
    },
    {
        name: 'Gold Earrings',
        slug: 'gold-earrings',
        description: 'Classic gold hoop earrings',
        category: 'Jewelry',
        unitType: 'PIECE',
        price: 850000,
        stock: 12,
        images: ['https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'],
        specifications: {
            'Material': '14k gold',
            'Style': 'Hoop',
            'Diameter': '20mm',
            'Closure': 'Lever back',
            'Packaging': 'Jewelry box'
        }
    }
];
async function main() {
    console.log('🌱 Starting database seeding...\n');
    console.log('📂 Creating categories...');
    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        });
    }
    console.log(`✅ Created ${categories.length} categories`);
    const categoryMap = new Map();
    for (const category of await prisma.category.findMany()) {
        categoryMap.set(category.name, category.id);
    }
    console.log('\n🏪 Creating merchants...');
    const merchantEmails = [
        'electronics@majet.com',
        'fashion@majet.com',
        'food@majet.com',
        'home@majet.com',
        'beauty@majet.com',
        'auto@majet.com',
        'books@majet.com',
        'sports@majet.com',
        'toys@majet.com',
        'jewelry@majet.com'
    ];
    const merchants = [];
    for (let i = 0; i < merchantEmails.length; i++) {
        const email = merchantEmails[i];
        const hashedPassword = await bcrypt.hash('merchant123', 10);
        const merchant = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                phone: null,
                name: `Merchant ${i + 1}`,
                role: 'MERCHANT',
                merchant: {
                    create: {
                        displayName: `${categories[i].name} Store`,
                        legalName: `${categories[i].name} Store Ltd`,
                        description: `Leading ${categories[i].name.toLowerCase()} retailer in Ethiopia`,
                        serviceAreas: [categories[i].name],
                        rating: 4.5 + Math.random() * 0.5,
                    }
                }
            },
            include: { merchant: true }
        });
        merchants.push(merchant);
    }
    console.log(`✅ Created ${merchants.length} merchants`);
    console.log('\n📦 Creating products...');
    for (const productData of products) {
        const categoryId = categoryMap.get(productData.category);
        const merchant = merchants[Math.floor(Math.random() * merchants.length)];
        const product = await prisma.product.create({
            data: {
                name: productData.name,
                slug: productData.slug,
                description: productData.description,
                categoryId,
                merchantId: merchant.merchant.id,
                images: productData.images,
                skus: {
                    create: {
                        name: productData.name,
                        unitType: productData.unitType,
                        unitIncrement: 1,
                        pricePerCanonicalUnit: productData.price,
                        currency: 'ETB',
                        active: true,
                        inventoryLots: {
                            create: {
                                merchantId: merchant.merchant.id,
                                quantity: productData.stock,
                                expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                            }
                        }
                    }
                }
            },
        });
    }
    console.log(`✅ Created ${products.length} products with SKUs`);
    console.log('\n👥 Creating sample users...');
    const userEmails = [
        'john.doe@example.com',
        'jane.smith@example.com',
        'mike.johnson@example.com',
        'sarah.wilson@example.com',
        'david.brown@example.com'
    ];
    for (const email of userEmails) {
        const hashedPassword = await bcrypt.hash('user123', 10);
        await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                phone: null,
                name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                role: 'USER',
                addresses: {
                    create: {
                        fullName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        phone: '+251900000000',
                        line1: `${Math.floor(Math.random() * 999) + 1} User Street`,
                        city: 'Addis Ababa',
                        region: 'Ethiopia',
                        postalCode: `${Math.floor(Math.random() * 9000) + 1000}`,
                        country: 'Ethiopia',
                    }
                }
            },
        });
    }
    console.log(`✅ Created ${userEmails.length} sample users`);
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Merchants: ${merchants.length}`);
    console.log(`- Products: ${products.length}`);
    console.log(`- Users: ${userEmails.length}`);
    console.log('\n🔑 Login Credentials:');
    console.log('Merchants: Use any merchant email with password "merchant123"');
    console.log('Users: Use any user email with password "user123"');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map