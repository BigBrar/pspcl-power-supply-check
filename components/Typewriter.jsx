import React, { useState, useEffect } from 'react';

const Typewriter = ({ phrases, typingSpeed = 50, deletingSpeed = 50, pauseDelay = 2000 }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    // Helper to find common prefix length
    const getCommonPrefixLength = (s1, s2) => {
        let i = 0;
        while (i < s1.length && i < s2.length && s1[i] === s2[i]) {
            i++;
        }
        return i;
    };

    useEffect(() => {
        const handleTyping = () => {
            const fullText = phrases[currentIndex];
            const nextIndex = (currentIndex + 1) % phrases.length;
            const nextText = phrases[nextIndex];
            const commonPrefixLen = getCommonPrefixLength(fullText, nextText);

            if (!isDeleting) {
                // Typing
                setCurrentText(fullText.substring(0, currentText.length + 1));

                if (currentText === fullText) {
                    // Pause before deleting
                    setTimeout(() => setIsDeleting(true), pauseDelay);
                    return;
                }
            } else {
                // Deleting - Stop at common prefix
                if (currentText.length > commonPrefixLen) {
                    setCurrentText(fullText.substring(0, currentText.length - 1));
                } else {
                    // Once we reach common prefix, switch to next phrase
                    setIsDeleting(false);
                    setCurrentIndex(nextIndex);
                    return;
                }
            }
        };


        const timer = setTimeout(
            handleTyping,
            isDeleting ? deletingSpeed : typingSpeed
        );

        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentIndex, phrases, typingSpeed, deletingSpeed, pauseDelay]);

    return (
        <span className="inline-flex items-center">
            {currentText}
            <span className="w-0.5 h-6 bg-amber-400 ml-1 animate-blink"></span>
        </span>
    );
};

export default Typewriter;
