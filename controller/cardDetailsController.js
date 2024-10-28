const CardDetails = require('../model/cardDetails');
const Tesseract = require('tesseract.js');
const path = require('path');

const Upload = async (req, res) => {
    try {
      const workerPath = path.join(__dirname, 'node_modules', 'tesseract.js-core', 'worker.min.js');
        const corePath = path.join(__dirname, 'node_modules', 'tesseract.js-core', 'tesseract-core-simd.wasm');
      const { data: { text } } = await Tesseract.recognize(
        req.file.buffer,
        'eng',
        {
            logger: info => console.log(info),
            corePath,
                workerPath
        }
    );

    const cardInfo = parseCardInfo(text);
    cardInfo.imageUrl = req.file.originalname;

    const card = new CardDetails(cardInfo);
    await card.save();

    res.status(200).json(card);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

const Cards = async (req,res) =>{
    const { page = 1, limit = 10 } = req.query;
  
  try {
    const cards = await CardDetails.find()
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

      console.log("cards.....",cards)

    const total = await CardDetails.countDocuments();
    
    res.status(200).json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      cards,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const parseCardInfo = (text) => {
    const lines = text.split('\n');
    const cardInfo = {};
  
    lines.forEach(line => {
      line = line.trim();
      if (line.includes('@')) {
        cardInfo.email = line;
      } else if (/^\d{10}$/.test(line)) {
        cardInfo.phoneNumber = line;
      } else if (!cardInfo.name) {
        cardInfo.name = line;
      } else if (!cardInfo.jobTitle) {
        cardInfo.jobTitle = line;
      } else if (!cardInfo.companyName) {
        cardInfo.companyName = line;
      } else {
        cardInfo.address = cardInfo.address ? `${cardInfo.address}, ${line}` : line;
      }
    });
  
    return cardInfo;
  };

  module.exports = {
    Upload, Cards
};