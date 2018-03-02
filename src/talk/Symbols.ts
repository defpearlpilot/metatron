
const RED = Symbol('Red');
const BLUE = Symbol('Blue');
const GREEN = Symbol('Green');

const str1 = 'I am a unique snowflake';
const str2 = 'I am a unique snowflake';

console.log('Are str1 and str2 equal?', str1 == str2);

const sym1 = Symbol('I am a unique snowflake');
const sym2 = Symbol('I am a unique snowflake');

console.log('Are sym1 and sym2 equal?', sym1 == sym2);

const map = {};

map[sym1] = 'unique';
map[sym2] = 'I too am unique';
map[str1] = 'I am the original';
map[str2] = 'I am the new model';

console.log('My map is', map);
