const bcrypt = require('bcryptjs');
const { User } = require('../models');
const sequelize = require('../config/database');

const seedUsers = async () => {
  try {
    // Ensure DB schemas are loaded and synced
    await sequelize.sync({ alter: true }); 
    
    const handles = ['shriram716', 'Cipher_Algo', 'rogithpm', 'Vishwa7805'];
    const defaultPassword = await bcrypt.hash('password123', 10);

    for (let handle of handles) {
      const email = `${handle.toLowerCase()}@eduverse.test`;
      
      const [user, created] = await User.findOrCreate({
        where: { leetcodeHandle: handle },
        defaults: {
          name: handle,
          email: email,
          password: defaultPassword,
          role: 'student',
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          totalSolved: 0,
          leetcodeRanking: 0
        }
      });
      
      if (created) {
        console.log(`Created new student profile for handle: ${handle}`);
      } else {
        console.log(`Student profile for ${handle} already exists. Skipping.`);
      }
    }
    
    console.log('Seeding complete. You can exit safely.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed users:', error);
    process.exit(1);
  }
};

seedUsers();
