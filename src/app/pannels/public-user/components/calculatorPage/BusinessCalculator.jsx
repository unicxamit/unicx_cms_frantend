import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react'; // Using lucide-react for the icon
import Header from '../component/Header';
import '../calculatorCss/ITRCalculator.css'; // Importing the CSS file for styling
// The main App component for the Coming Soon page
const BusinessCalculator = () => {
  // Define the target date for the countdown.
  // This is set to one week from the current date.
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7);

  // State to hold the countdown values (days, hours, minutes, seconds)
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // State for the email input field and notification message
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Calculates the time remaining until the target date.
   * @returns {object} An object containing the remaining days, hours, minutes, and seconds.
   */
  const calculateTimeRemaining = () => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    // If the countdown is finished, return zeros
    if (distance < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    // Calculate the time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  // useEffect hook to set up and clean up the countdown timer
  useEffect(() => {
    // Update the countdown initially
    setCountdown(calculateTimeRemaining());

    // Set up an interval to update the countdown every second
    const interval = setInterval(() => {
      setCountdown(calculateTimeRemaining());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // The empty dependency array ensures this effect runs only once on mount

  // Handle email submission
  const handleNotifyMe = () => {
    if (email.trim() === '') {
      setMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    // Simulate a successful API call or server interaction
    setTimeout(() => {
      setMessage(`Thanks for your interest, we'll notify you at ${email}!`);
      setEmail('');
      setIsLoading(false);
    }, 1500);
  };

  // A helper component to render each countdown digit with its label
  const CountdownItem = ({ value, label }) => (
    <div className="countdown-item">
      <span className="countdown-value">{value}</span>
      <span className="countdown-label">{label}</span>
    </div>
  );

  return (
    <>
      <Header />
      <section className="container-div mt-14">
        <section className="second-container">
          <section className="title-section">
            <h1 className="title-heading">Business Calculator</h1>
          </section>

          <div className="main-grid">
            <div className="left-content">
              <h1 className="coming-heading">Coming Soon</h1>
              <p className="coming-text">
                We're working hard to launch our new <strong className="blue-strong">Business Calculator</strong>. Follow us for updates...
              </p>

              <div className="notify-box">
                <h2 className="notify-heading">Stay Notified</h2>
                <p className="notify-subtext">Enter your email to receive an alert...</p>
                <div className="notify-form">
                  <div className="email-wrapper">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="email-input"
                    />
                  </div>
                  <button
                    onClick={handleNotifyMe}
                    disabled={isLoading}
                    className="notify-button"
                  >
                    {isLoading ? (
                      <svg className="spinner" /* svg props */ />
                    ) : (
                      "Notify Me"
                    )}
                  </button>
                </div>
                {message && (
                  <p className={`notify-message ${message.includes('Thanks') ? 'success' : 'error'}`}>
                    {message}
                  </p>
                )}
              </div>

              <div className="social-section"></div>


            </div>

            <div className="countdown-wrapper">
              <CountdownItem value={countdown.days} label="Days" />
              <CountdownItem value={countdown.hours} label="Hours" />
              <CountdownItem value={countdown.minutes} label="Minutes" />
              <CountdownItem value={countdown.seconds} label="Seconds" />
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default BusinessCalculator;