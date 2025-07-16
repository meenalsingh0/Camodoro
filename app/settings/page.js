'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    workDuration: 25,
    breakDuration: 5,
    autoResume: true,
    darkMode: true
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newSettings = {
      ...settings,
      [name]: type === 'checkbox' ? checked : Number(value)
    };
    setSettings(newSettings);
    localStorage.setItem('pomodoroSettings', JSON.stringify(newSettings));
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl mb-6 border-b border-gray-800 pb-2">Settings</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block mb-2">Work Duration (minutes)</label>
            <input
              type="number"
              name="workDuration"
              value={settings.workDuration}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 p-2"
              min="1"
              max="60"
            />
          </div>

          <div>
            <label className="block mb-2">Break Duration (minutes)</label>
            <input
              type="number"
              name="breakDuration"
              value={settings.breakDuration}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 p-2"
              min="1"
              max="30"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="autoResume"
              checked={settings.autoResume}
              onChange={handleChange}
              className="mr-2"
              id="autoResume"
            />
            <label htmlFor="autoResume">Auto-resume when detected</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="darkMode"
              checked={settings.darkMode}
              onChange={handleChange}
              className="mr-2"
              id="darkMode"
            />
            <label htmlFor="darkMode">Dark Mode</label>
          </div>
        </div>

        <Link href="/" className="mt-8 inline-block border border-gray-700 px-4 py-2 hover:bg-gray-900 transition">
          Back to Timer
        </Link>
      </div>
    </div>
  );
}