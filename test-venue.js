// Test venue assignment logic
console.log('=== Test Venue Assignment ===');

for (let matchIndex = 0; matchIndex < 10; matchIndex++) {
  const venue = (matchIndex % 2 === 0) ? 'สนาม 1' : 'สนาม 2';
  console.log(`Match ${matchIndex + 1}: matchIndex=${matchIndex}, ${matchIndex} % 2 = ${matchIndex % 2}, venue = ${venue}`);
}

console.log('\n=== Expected Pattern ===');
console.log('Match 1: สนาม 1');
console.log('Match 2: สนาม 2'); 
console.log('Match 3: สนาม 1');
console.log('Match 4: สนาม 2');
console.log('Match 5: สนาม 1');
console.log('Match 6: สนาม 2');
console.log('Match 7: สนาม 1');
console.log('Match 8: สนาม 2');