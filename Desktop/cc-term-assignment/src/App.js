import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const Home = ({ email, setEmail, image, setImage, message, setMessage, handleEmailChange, handleImageChange, handleImageUpload }) => (
    <div className="info">
        Welcome to Image Processing app!!
        <div className="login-box">
            <input className="btn" type="email" placeholder="Enter your email ID" value={email} onChange={handleEmailChange} />
            <input type="file" onChange={handleImageChange} />
            <button className="btn" onClick={handleImageUpload}>Upload</button>
            <p>{message}</p>
        </div>
    </div>
);

const Face_Detection = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleGenerateAnalysis = async () => {
        const face_detection_url = process.env.REACT_APP_FACE_DETECTION_API_GATEWAY_URL;
        if (!email) {
            setMessage('Please enter your email ID');
            return;
        }

        const payload = {
            email: email
        };

        try {
            const response = await axios.post(face_detection_url, payload);
            const result = JSON.parse(response.data.body);

            if (!result.FaceDetails || result.FaceDetails.length === 0) {
                setMessage('No face detected');
                setAnalysisResult(null);
            } else {
                setAnalysisResult(result);
                setMessage('Analysis request sent successfully');
            }
        } catch (error) {
            console.error('Analysis request error:', error);
            setMessage('Error generating analysis');
        }
    };

    return (
        <div className="content">
            <input className="btn" type="email" placeholder="Enter your email ID" value={email} onChange={handleEmailChange} />
            <button className="btn" onClick={handleGenerateAnalysis}>Generate Analysis</button>
            <p>{message}</p>
            {analysisResult && (
                <div>
                    <h3>Analysis Result:</h3>
                    <ul>
                        <li><strong>Age Range:</strong> {analysisResult.FaceDetails[0].AgeRange.Low} - {analysisResult.FaceDetails[0].AgeRange.High}</li>
                        <li><strong>Gender:</strong> {analysisResult.FaceDetails[0].Gender.Value}</li>
                        <li><strong>Smile:</strong> {analysisResult.FaceDetails[0].Smile.Value ? 'Smiling' : 'Not Smiling'}</li>
                        <li><strong>Emotions:</strong>
                            <ul>
                                {analysisResult.FaceDetails[0].Emotions.map((emotion, index) => (
                                    <li key={index}>{emotion.Type}: {emotion.Confidence.toFixed(2)}%</li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

const Extract_Text = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [extractedText, setExtractedText] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleExtractText = async () => {
        const text_extraction_url = process.env.REACT_APP_TEXT_EXTRACTION_API_GATEWAY_URL;
        if (!email) {
            setMessage('Please enter your email ID');
            return;
        }

        const payload = {
            email: email
        };

        try {
            const response = await axios.post(text_extraction_url, payload);
            const result = JSON.parse(response.data.body);

            // Extract lines of text from the response
            const lines = result.Blocks.filter(block => block.BlockType === 'LINE')
                .map(block => block.Text);

            const uniqueLines = Array.from(new Set(lines));

            if (!uniqueLines.length) {
                setMessage('No text found');
                setExtractedText('');
            } else {
                setExtractedText(uniqueLines.join(' '));
                setMessage('Text extracted successfully');
            }
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
                setMessage(`Error extracting text: ${error.response.data.message || error.response.status}`);
            } else if (error.request) {
                // Request was made but no response was received
                console.error('Error request:', error.request);
                setMessage('Error extracting text: No response from server');
            } else {
                // Something happened in setting up the request
                console.error('Error message:', error.message);
                setMessage(`Error extracting text: ${error.message}`);
            }
        }
    };

    return (
        <div className="content">
            <input className="btn" type="email" placeholder="Enter your email ID" value={email} onChange={handleEmailChange} />
            <button className="btn" onClick={handleExtractText}>Extract Text</button>
            <p>{message}</p>
            {extractedText && (
                <div>
                    <h3>Extracted Text:</h3>
                    <p>{extractedText}</p>
                </div>
            )}
        </div>
    );
};

const App = () => {
    const [email, setEmail] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleImageUpload = async () => {
        if (!image || !email) {
            setMessage('Please upload an image and enter your email ID');
            return;
        }

        const reader = new FileReader();
        const imgUploadURL = process.env.REACT_APP_IMAGE_UPLOAD_API_GATEWAY_URL;
        console.log('imgUploadURL:', imgUploadURL);
        reader.onloadend = async () => {
            const base64Image = reader.result.split(',')[1];
            const payload = {
                email: email,
                image_data: base64Image
            };

            try {
                const response = await axios.post(imgUploadURL, payload);
                setMessage('Image uploaded successfully');
                // Clear input fields after successful upload (optional)
                setEmail('');
                setImage(null);
            } catch (error) {
                console.error('Image upload error:', error);
                setMessage('Image upload error');
            }
        };
        reader.readAsDataURL(image);
    };

    return (
        <Router>
            <header className="header">
                <Link to="/">Home</Link>
                <Link to="/detection">Face Detection</Link>
                <Link to="/extract">Extract Text</Link>
            </header>
            <Routes>
                <Route path="/" element={<Home 
                    email={email}
                    setEmail={setEmail}
                    image={image}
                    setImage={setImage}
                    message={message}
                    setMessage={setMessage}
                    handleEmailChange={handleEmailChange}
                    handleImageChange={handleImageChange}
                    handleImageUpload={handleImageUpload} 
                />} />
                <Route path="/detection" element={<Face_Detection />} />
                <Route path="/extract" element={<Extract_Text  />} />
            </Routes>
        </Router>
    );
};

export default App;
