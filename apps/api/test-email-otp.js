const { PrismaClient } = require('@prisma/client');

async function testEmailOtp() {
  const prisma = new PrismaClient();
  
  try {
    // Test OTP request
    console.log('Testing email OTP system...');
    
    // Get latest OTP for the email
    const otp = await prisma.otp.findFirst({
      where: {
        phone: 'asmamawkassahun2016@gmail.com' // Using phone field to store email
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (otp) {
      console.log(`\n📧 Latest OTP for asmamawkassahun2016@gmail.com:`);
      console.log(`Code: ${otp.code}`);
      console.log(`Expires at: ${otp.expiresAt}`);
      console.log(`Used: ${otp.used}`);
      console.log(`Created at: ${otp.createdAt}\n`);
      
      // Test verification
      console.log('Testing OTP verification...');
      const testResult = await fetch('http://localhost:3002/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'asmamawkassahun2016@gmail.com',
          code: otp.code
        })
      });
      
      const result = await testResult.json();
      console.log('Verification result:', result);
      
    } else {
      console.log('No OTP found for asmamawkassahun2016@gmail.com');
    }
  } catch (error) {
    console.error('Error testing email OTP:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEmailOtp();








