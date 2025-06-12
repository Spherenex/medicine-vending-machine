import React, { useState } from 'react';
import '../styles/AIChatbot.css'; // Import your CSS styles for the chatbot
const AIChatbot = () => {
    const [chatMessages, setChatMessages] = useState([
        {
            type: 'bot',
            message: 'Hello! I can help you find the right medicine based on your symptoms. Please select a symptom to begin:',
            options: ['Fever', 'Headache', 'Body Pain', 'Cough', 'Cold', 'Stomach Ache']
        }
    ]);

    const [userInput, setUserInput] = useState('');
    const [chatStage, setChatStage] = useState('symptom-selection');
    const [selectedSymptom, setSelectedSymptom] = useState(null);
    const [symptomDetails, setSymptomDetails] = useState(null);
    const [symptomDuration, setSymptomDuration] = useState(null);
    const [medicationHistory, setMedicationHistory] = useState(null);
    const [medicalConditions, setMedicalConditions] = useState(null);

    // Handle option selection
    const handleOptionSelect = (option) => {
        // Add user selection to chat
        const newMessages = [...chatMessages, { type: 'user', message: option }];

        if (chatStage === 'symptom-selection') {
            setSelectedSymptom(option);

            // Ask follow-up question based on selected symptom
            let followUpQuestion = '';
            let followUpOptions = [];

            switch (option.toLowerCase()) {
                case 'fever':
                    followUpQuestion = 'How high is your fever?';
                    followUpOptions = ['Mild (98-100°F)', 'Moderate (100-102°F)', 'High (Above 102°F)'];
                    break;
                case 'headache':
                    followUpQuestion = 'What type of headache do you have?';
                    followUpOptions = ['Mild', 'Moderate', 'Severe', 'Migraine-like'];
                    break;
                case 'body pain':
                    followUpQuestion = 'Where is the pain located?';
                    followUpOptions = ['Joints', 'Muscles', 'Back', 'General body ache'];
                    break;
                case 'cough':
                    followUpQuestion = 'What type of cough do you have?';
                    followUpOptions = ['Dry cough', 'Wet cough', 'Persistent cough'];
                    break;
                case 'cold':
                    followUpQuestion = 'What are your cold symptoms?';
                    followUpOptions = ['Runny nose', 'Nasal congestion', 'Sneezing', 'Sore throat'];
                    break;
                case 'stomach ache':
                    followUpQuestion = 'How would you describe your stomach pain?';
                    followUpOptions = ['Cramps', 'Bloating', 'Sharp pain', 'Dull pain'];
                    break;
                default:
                    followUpQuestion = 'Can you provide more details about your symptoms?';
            }

            newMessages.push({
                type: 'bot',
                message: followUpQuestion,
                options: followUpOptions
            });

            setChatStage('symptom-details');
        }
        else if (chatStage === 'symptom-details') {
            setSymptomDetails(option);

            // Ask about duration
            newMessages.push({
                type: 'bot',
                message: 'How long have you been experiencing these symptoms?',
                options: ['Less than 24 hours', '1-3 days', '4-7 days', 'More than a week']
            });

            setChatStage('symptom-duration');
        }
        else if (chatStage === 'symptom-duration') {
            setSymptomDuration(option);

            // Ask about previous medication
            newMessages.push({
                type: 'bot',
                message: 'Have you taken any medication for these symptoms already?',
                options: ['Yes, with some relief', 'Yes, but no relief', 'No, not yet']
            });

            setChatStage('medication-history');
        }
        else if (chatStage === 'medication-history') {
            setMedicationHistory(option);

            // Ask about existing medical conditions
            newMessages.push({
                type: 'bot',
                message: 'Do you have any existing medical conditions I should know about?',
                options: ['High blood pressure', 'Diabetes', 'Heart condition', 'Stomach/Digestive issues', 'Allergies', 'None of these']
            });

            setChatStage('medical-conditions');
        }
        else if (chatStage === 'medical-conditions') {
            setMedicalConditions(option);

            // Show summary of inputs before recommendation
            const summaryMessage = `Based on your input:\n• Symptom: ${selectedSymptom}\n• Details: ${symptomDetails}\n• Duration: ${symptomDuration}\n• Previous medication: ${medicationHistory}\n• Medical conditions: ${option}`;

            newMessages.push({
                type: 'bot',
                message: summaryMessage,
                options: ['Get recommendation']
            });

            setChatStage('summary');
        }
        else if (chatStage === 'summary') {
            // Provide detailed recommendation based on all collected information
            let recommendation = '';
            let medicineImage = '';
            let medicineName = '';
            let medicineDetails = '';
            let dosage = '';
            let sideEffects = '';
            let warnings = '';

            // Logic to determine which medicine to recommend
            if (selectedSymptom.toLowerCase() === 'fever') {
                if (symptomDetails.includes('High')) {
                    medicineName = 'Dolo 650mg';
                    medicineImage = '💊';
                    medicineDetails = 'Dolo 650mg contains Paracetamol in a higher dosage and is specifically formulated for high fever.';
                    dosage = 'Take 1 tablet every 6 hours. Do not exceed 4 tablets in 24 hours.';
                    sideEffects = 'Generally well-tolerated. Rare side effects include nausea, allergic reactions.';

                    if (medicalConditions.includes('Liver')) {
                        warnings = 'Caution: Those with liver conditions should consult a doctor before taking this medication.';
                    } else {
                        warnings = 'Do not take with other Paracetamol-containing products to avoid overdose.';
                    }

                    recommendation = `I recommend ${medicineName} for your high fever. ${medicineDetails}`;
                } else {
                    medicineName = 'Paracetamol 500mg';
                    medicineImage = '💊';
                    medicineDetails = 'Paracetamol 500mg is effective for mild to moderate fever and provides general relief with minimal side effects.';
                    dosage = 'Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.';
                    sideEffects = 'Generally well-tolerated. Rare side effects include mild stomach discomfort.';
                    warnings = 'Safe for most people including those with high blood pressure and heart conditions.';

                    recommendation = `I recommend ${medicineName} for your mild to moderate fever. ${medicineDetails}`;
                }
            }
            else if (selectedSymptom.toLowerCase() === 'body pain' || selectedSymptom.toLowerCase() === 'headache') {
                if (symptomDetails.includes('Severe') || symptomDetails.includes('Migraine') || symptomDetails.includes('Joints')) {
                    if (medicationHistory.includes('no relief') || symptomDuration.includes('More than a week')) {
                        medicineName = 'Brufen 400mg';
                        medicineImage = '💊';
                        medicineDetails = 'Brufen 400mg (Ibuprofen) is a stronger anti-inflammatory that provides effective relief for severe pain, especially for joints and intense headaches.';
                        dosage = 'Take 1 tablet every 8 hours after food. Do not exceed 3 tablets in 24 hours.';
                        sideEffects = 'May cause stomach irritation, dizziness, or heartburn. Take with food to minimize stomach issues.';

                        if (medicalConditions.includes('Stomach') || medicalConditions.includes('Heart')) {
                            warnings = 'CAUTION: People with stomach/digestive issues or heart conditions should consult a doctor before taking this medication.';
                        } else {
                            warnings = 'Do not take on an empty stomach. Not recommended for long-term use without medical supervision.';
                        }

                        recommendation = `Based on your severe pain and other factors, I recommend ${medicineName}. ${medicineDetails}`;
                    } else {
                        medicineName = 'Paracetamol 500mg';
                        medicineImage = '💊';
                        medicineDetails = 'Paracetamol 500mg is a good first option for pain relief with fewer side effects than anti-inflammatory medications.';
                        dosage = 'Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.';
                        sideEffects = 'Generally well-tolerated with minimal side effects.';
                        warnings = 'If pain persists for more than 3 days, consult a healthcare professional.';

                        recommendation = `I recommend starting with ${medicineName} for your pain. ${medicineDetails}`;
                    }
                } else {
                    medicineName = 'Paracetamol 500mg';
                    medicineImage = '💊';
                    medicineDetails = 'Paracetamol 500mg provides effective pain relief with fewer side effects than anti-inflammatory medications.';
                    dosage = 'Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.';
                    sideEffects = 'Generally well-tolerated with minimal side effects.';
                    warnings = 'If pain persists for more than 3 days, consult a healthcare professional.';

                    recommendation = `For your mild to moderate pain, I recommend ${medicineName}. ${medicineDetails}`;
                }
            }
            else if (selectedSymptom.toLowerCase() === 'cough' || selectedSymptom.toLowerCase() === 'cold') {
                medicineName = 'Paracetamol 500mg';
                medicineImage = '💊';
                medicineDetails = 'While Paracetamol 500mg doesn\'t directly treat cough or cold, it can help relieve associated discomfort and any fever.';
                dosage = 'Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.';
                sideEffects = 'Generally well-tolerated with minimal side effects.';
                warnings = 'This will only address symptoms like headache or mild fever. For persistent cough, consult a doctor.';

                recommendation = `For your ${selectedSymptom.toLowerCase()} symptoms, I recommend ${medicineName} to help with associated discomfort. ${medicineDetails}`;
            }
            else if (selectedSymptom.toLowerCase().includes('stomach')) {
                medicineName = 'Paracetamol 500mg';
                medicineImage = '💊';
                medicineDetails = 'For stomach discomfort, specific medications are usually recommended, but Paracetamol 500mg may help with associated pain.';
                dosage = 'Take 1 tablet every 6 hours if needed for pain. Do not exceed 4 tablets in 24 hours.';
                sideEffects = 'Generally well-tolerated when taken as directed.';
                warnings = 'IMPORTANT: Paracetamol does not treat the cause of stomach issues. If symptoms persist beyond 24 hours, please consult a doctor.';

                recommendation = `For your stomach discomfort, I recommend ${medicineName} for temporary relief of associated pain. ${medicineDetails}`;
            }

            const detailedRecommendation = `
                                ${medicineImage} **${medicineName}**

                                ${recommendation}

                                **Dosage:** ${dosage}

                                **Possible Side Effects:** ${sideEffects}

                                **Warnings:** ${warnings}

                                Would you like to proceed with this recommendation?`;

            newMessages.push({
                type: 'bot',
                message: detailedRecommendation,
                options: ['Yes, I will take this medicine', 'No, I would like to consult a doctor', 'Start Over']
            });

            setChatStage('final-recommendation');
        }
        else if (chatStage === 'final-recommendation') {
            if (option === 'Start Over') {
                // Reset chat
                setChatMessages([
                    {
                        type: 'bot',
                        message: 'Hello! I can help you find the right medicine based on your symptoms. Please select a symptom to begin:',
                        options: ['Fever', 'Headache', 'Body Pain', 'Cough', 'Cold', 'Stomach Ache']
                    }
                ]);
                setSelectedSymptom(null);
                setSymptomDetails(null);
                setSymptomDuration(null);
                setMedicationHistory(null);
                setMedicalConditions(null);
                setChatStage('symptom-selection');
                return;
            } else if (option.includes('Yes')) {
                newMessages.push({
                    type: 'bot',
                    message: 'Your medicine has been dispensed. Please collect it from the tray below. Remember to follow the dosage instructions carefully and consult a doctor if symptoms persist.',
                    options: ['Start Over']
                });
            } else {
                newMessages.push({
                    type: 'bot',
                    message: 'I understand you would like to consult a doctor. Thats often the safest approach. Would you like me to provide information about nearby medical facilities or connect you to our telemedicine service?',
                    options: ['Nearby clinics', 'Telemedicine service', 'Start Over']
                });
            }
        }
        else if (option === 'Nearby clinics' || option === 'Telemedicine service') {
            if (option === 'Nearby clinics') {
                newMessages.push({
                    type: 'bot',
                    message: 'I have located several medical facilities near you:\n\n1. City Medical Center - 0.5 miles\n2. Quick Care Clinic - 1.2 miles\n3. Family Health Practice - 2.1 miles\n\nWould you like directions to any of these?',
                    options: ['Start Over']
                });
            } else {
                newMessages.push({
                    type: 'bot',
                    message: 'Our telemedicine service is available 24/7. A doctor can speak with you via video call within 15-30 minutes. The consultation fee is ₹299. Would you like to book an appointment now?',
                    options: ['Start Over']
                });
            }
        }

        setChatMessages(newMessages);
    };

    // Handle text input submission
    const handleChatSubmit = () => {
        if (!userInput.trim()) return;

        const newMessages = [...chatMessages, { type: 'user', message: userInput }];

        newMessages.push({
            type: 'bot',
            message: 'Please use the option buttons to navigate through the symptom checker for the most accurate recommendations.',
            options: ['Fever', 'Headache', 'Body Pain', 'Cough', 'Cold', 'Stomach Ache']
        });

        setChatMessages(newMessages);
        setUserInput('');
        setChatStage('symptom-selection');
    };

    return (
        <div className="chat-container">
            <h3 className="chat-header">🤖 AI Symptom Assistant</h3>
            <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.type === 'user' ? 'user-message' : 'bot-message'}`}>
                        <strong>{msg.type === 'user' ? 'You' : 'AI Assistant'}:</strong>
                        <p>{msg.message}</p>

                        {msg.options && (
                            <div className="chat-options">
                                {msg.options.map((option, optIndex) => (
                                    <button
                                        key={optIndex}
                                        className="option-button"
                                        onClick={() => handleOptionSelect(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type a message..."
                    className="chat-input-field"
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                />
                <button onClick={handleChatSubmit} className="chat-button">
                    Send
                </button>
            </div>
        </div>
    );
};

export default AIChatbot;