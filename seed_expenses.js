const http = require('http');

const expenses = [
  {
    title: 'Lunch at café',
    amount: 12.50,
    category_id: 1, // Food
    note: 'Had the pasta',
    spent_at: '2026-06-01'
  },
  {
    title: 'Uber ride',
    amount: 15.00,
    category_id: 2, // Transport
    note: 'Late night from office',
    spent_at: '2026-06-02'
  },
  {
    title: 'New keyboard',
    amount: 120.00,
    category_id: 5, // Shopping
    note: 'Mechanical keyboard for coding',
    spent_at: '2026-06-03'
  }
];

const postExpense = (expenseData) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(expenseData);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/expenses',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        if (res.statusCode === 201) {
          console.log(`✅ Created: ${expenseData.title} ($${expenseData.amount})`);
          resolve();
        } else {
          console.error(`❌ Failed to create ${expenseData.title}: ${responseBody}`);
          reject(new Error(responseBody));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error connecting to server: ${error.message}`);
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

async function seed() {
  console.log('🌱 Starting to seed expenses...\n');
  for (const exp of expenses) {
    try {
      await postExpense(exp);
    } catch (e) {
      // ignore and continue
    }
  }
  console.log('\n✨ Done seeding expenses!');
  console.log('You can now view them by going to: http://localhost:3000/api/expenses');
}

seed();
