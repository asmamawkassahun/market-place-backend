const { PrismaClient } = require('@prisma/client');

async function fixUserData() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Fixing user data...\n');
    
    // Find users where phone field contains email
    const usersWithWrongPhone = await prisma.user.findMany({
      where: {
        phone: {
          contains: '@'
        }
      }
    });
    
    console.log(`Found ${usersWithWrongPhone.length} users with email in phone field`);
    
    for (const user of usersWithWrongPhone) {
      console.log(`Fixing user: ${user.email}`);
      console.log(`  Current phone: ${user.phone}`);
      
      // Set phone to null since we're using email-based auth
      await prisma.user.update({
        where: { id: user.id },
        data: { phone: null }
      });
      
      console.log(`  ✅ Fixed: phone set to null`);
    }
    
    console.log('\n🎉 User data fixed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserData();








