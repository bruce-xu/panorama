/**
 * 生成随机数
 * @param {number} len 随机数长度
 */
function random(len = 8) {
  const seed = 'abcdefghijklmnopqrstuvwxyz';
  const seedLen = seed.length;
  const text = [];
  for (let i = 0; i < len; i++) {
    text[i] = seed[Math.floor(Math.random() * seedLen)];
  }

  return text.join('');
}

module.exports = random;