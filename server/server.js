const ffmpeg = require('fluent-ffmpeg');
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const app = express();
const upload = multer({ dest: 'uploads/' });

ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg.exe'); // Adjust the path as necessary for your installation

async function query(filename) {
  const data = fs.readFileSync(filename);
  const response = await fetch(
      "https://api-inference.huggingface.co/models/Baghdad99/saad-speech-recognition-hausa-audio-to-text",
      {
          headers: {
              Authorization: "Bearer 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"
          },
          method: "POST",
          body: data
      }
  );
  const result = await response.json();
  return result;
}

module.exports = { query };

app.post('/mp3totext', upload.single('audio'), async (req, res) => {
  try {
      const audio = req.file;

      if (!audio) {
          return res.status(400).send({ message: 'No audio file uploaded' });
      }

      // Assuming audio is uploaded correctly and stored in 'audio.path'
      const text = await query(audio.path);
      console.log('Converted text:', text);
      res.json({ text });
  } catch (error) {
      console.error('Error extracting audio:', error);
      res.status(500).send({ message: 'Error extracting audio' });
  }
});

const extractAudio = (videoFile) => {
  return new Promise((resolve, reject) => {
    const outputStream = fs.createWriteStream(videoFile.path + '.mp3');

    ffmpeg()
      .input(videoFile.path)
      .output(outputStream)
      .outputFormat('mp3')
      .on('end', () => {
        console.log('Conversion finished!');
        resolve(videoFile.path + '.mp3');
      })
      .on('error', (err) => {
        console.error('Error:', err);
        reject(err);
      })
      .run();
  });
};

app.post('/mp4tomp3', upload.single('video'), async (req, res) => {
  try {
    const video = req.file;

    if (!video) {
      return res.status(400).send({ message: 'No video file uploaded' });
    }

    if (!video.mimetype.startsWith('video/')) {
      return res.status(400).send({ message: 'Invalid file type. Please upload an MP4 video.' });
    }

    const audioFilePath = await extractAudio(video);

    res.download(audioFilePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send({ message: 'Error downloading audio file' });
      } else {
        console.log('Audio file sent to client');
        // Optionally, you can clean up the temporary video and audio files here
        // fs.unlinkSync(video.path);
        // fs.unlinkSync(audioFilePath);
      }
    });
  } catch (error) {
    console.error('Error extracting audio:', error);
    res.status(500).send({ message: 'Error extracting audio' });
  }
});

app.listen(5000, () => console.log('Server listening on port 5000'));
