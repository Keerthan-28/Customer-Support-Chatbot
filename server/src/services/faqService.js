const fs = require('fs');
const path = require('path');

const FAQ_FILE = path.join(__dirname, '../data/faq_dataset.json');
let faqs = [];

try {
  faqs = JSON.parse(fs.readFileSync(FAQ_FILE, 'utf-8'));
} catch (err) {
  console.warn("Could not load faq_dataset.json. Using empty FAQ array.");
}

exports.findMatch = (query, language = 'en') => {
  if (!query) return null;
  const lower = query.toLowerCase().trim();
  let best = null;
  let topScore = 0;

  for (const faq of faqs) {
    let score = 0;
    for (const kw of faq.keywords) {
      if (lower.includes(kw)) score += kw.length;
    }
    if (score > topScore) { topScore = score; best = faq; }
  }

  return topScore >= 4 ? best : null;
};

exports.getAllFAQs = () => faqs.map(({ category, keywords }) => ({ category, keywords }));
