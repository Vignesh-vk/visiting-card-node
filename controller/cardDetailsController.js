const CardDetails = require('../model/cardDetails');
const tesseract = require('tesseract.js');

const Upload = async (req, res) => {
  try {
    console.log("Request File:", req.file);

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Create Tesseract worker
        const worker = tesseract.createWorker({
            logger: info => console.log(info), // Optional logger
            workerPath: './public/wasm/tesseract-core-simd.wasm', // Update path as necessary
            corePath: './public/wasm/tesseract-core.wasm' // Update path as necessary
        });

        // Load the worker and recognize text
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');

        // Recognize text from the image buffer
        const { data: { text: extractedText } } = await worker.recognize(req.file.buffer);
        
        // Terminate the worker after use
        await worker.terminate();

        console.log("OCR Result:", extractedText);

        const cardInfo = parseCardInfo(extractedText); // Assuming you have this function
        cardInfo.imageUrl = req.file.originalname;

        const card = new CardDetails(cardInfo);
        await card.save();

        res.status(200).json(card);
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
}


const Cards = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const cards = await CardDetails.find()
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

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