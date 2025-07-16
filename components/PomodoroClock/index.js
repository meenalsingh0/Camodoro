'use client';
import { useState, useEffect, useRef } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import Link from 'next/link';
import styles from './styles.module.css';

export default function PomodoroClock() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Ready to start');
  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const [settings, setSettings] = useState({
    workDuration: 25,
    breakDuration: 5,
    autoResume: true,
    darkMode: true
  });

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
      setTimeLeft(JSON.parse(savedSettings).workDuration * 60);
    }
  }, []);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setStatus('Session completed!');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Load model and setup camera
  useEffect(() => {
    async function loadModel() {
      const model = await cocoSsd.load();
      modelRef.current = model;
    }
    loadModel();

    return () => {
      if (modelRef.current) {
        modelRef.current.dispose();
      }
    };
  }, []);

  // Camera and detection logic
  useEffect(() => {
    if (!isActive) return;

    let stream;
    async function enableCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
    enableCamera();

    const detectInterval = setInterval(async () => {
      if (modelRef.current && videoRef.current) {
        const predictions = await modelRef.current.detect(videoRef.current);
        const personDetected = predictions.some(p => p.class === 'person');
        
        if (!personDetected && settings.autoResume) {
          setIsActive(false);
          setStatus('Paused - No person detected');
        }
      }
    }, 1000);

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      clearInterval(detectInterval);
    };
  }, [isActive, settings.autoResume]);

  const startTimer = () => {
    setIsActive(true);
    setStatus('Timer running');
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(settings.workDuration * 60);
    setStatus('Ready to start');
  };

  return (
    <div className={styles.container}>
      <div className={styles.clockPanel}>
        <div className={styles.fliqloDisplay}>
          {formatTime(timeLeft)}
        </div>
        <div className={styles.controls}>
          <button 
            onClick={startTimer}
            className={styles.controlButton}
            disabled={isActive}
          >
            START
          </button>
          <button 
            onClick={resetTimer}
            className={styles.controlButton}
          >
            RESET
          </button>
          <Link href="/settings" className={styles.settingsButton}>
            SETTINGS
          </Link>
          <Link href="/insights" className={styles.settingsButton}>
          VIEW INSIGHTS
          </Link>
        </div>
      </div>

      <div className={styles.cameraPanel}>
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          className={styles.cameraFeed}
        />
        <div className={styles.statusDisplay}>
          {status}
        </div>
      </div>
    </div>
  );
}