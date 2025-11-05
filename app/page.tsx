'use client';

import { useState, useEffect, useRef } from 'react';

type Command = {
  command: string;
  action: string;
  timestamp: Date;
};

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commands, setCommands] = useState<Command[]>([]);
  const [lastAction, setLastAction] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(interimTranscript || finalTranscript);

        if (finalTranscript) {
          processCommand(finalTranscript.trim().toLowerCase());
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setIsSupported(false);
        }
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };

      recognitionRef.current = recognition;
    }
  }, [isListening]);

  const processCommand = (command: string) => {
    let action = '';

    // Phone control commands
    if (command.includes('call') || command.includes('dial')) {
      const contact = command.replace(/call|dial/gi, '').trim();
      action = `📞 Calling ${contact || 'contact'}`;
      speak(`Calling ${contact || 'contact'}`);
    } else if (command.includes('text') || command.includes('message')) {
      const contact = command.replace(/text|message|send/gi, '').trim();
      action = `💬 Opening messages for ${contact || 'contact'}`;
      speak(`Opening messages for ${contact || 'contact'}`);
    } else if (command.includes('volume up') || command.includes('increase volume')) {
      action = '🔊 Increasing volume';
      speak('Increasing volume');
    } else if (command.includes('volume down') || command.includes('decrease volume')) {
      action = '🔉 Decreasing volume';
      speak('Decreasing volume');
    } else if (command.includes('mute') || command.includes('silent')) {
      action = '🔇 Muting phone';
      speak('Muting phone');
    } else if (command.includes('unmute')) {
      action = '🔔 Unmuting phone';
      speak('Unmuting phone');
    } else if (command.includes('brightness up') || command.includes('increase brightness')) {
      action = '☀️ Increasing brightness';
      speak('Increasing brightness');
    } else if (command.includes('brightness down') || command.includes('decrease brightness')) {
      action = '🌙 Decreasing brightness';
      speak('Decreasing brightness');
    } else if (command.includes('wifi on') || command.includes('enable wifi')) {
      action = '📶 Enabling WiFi';
      speak('Enabling WiFi');
    } else if (command.includes('wifi off') || command.includes('disable wifi')) {
      action = '📵 Disabling WiFi';
      speak('Disabling WiFi');
    } else if (command.includes('bluetooth on') || command.includes('enable bluetooth')) {
      action = '🔵 Enabling Bluetooth';
      speak('Enabling Bluetooth');
    } else if (command.includes('bluetooth off') || command.includes('disable bluetooth')) {
      action = '⚫ Disabling Bluetooth';
      speak('Disabling Bluetooth');
    } else if (command.includes('camera') || command.includes('take photo') || command.includes('take picture')) {
      action = '📸 Opening camera';
      speak('Opening camera');
    } else if (command.includes('flashlight on') || command.includes('turn on flashlight')) {
      action = '🔦 Turning on flashlight';
      speak('Turning on flashlight');
    } else if (command.includes('flashlight off') || command.includes('turn off flashlight')) {
      action = '💡 Turning off flashlight';
      speak('Turning off flashlight');
    } else if (command.includes('open') && command.includes('app')) {
      const appName = command.replace(/open|app/gi, '').trim();
      action = `📱 Opening ${appName || 'app'}`;
      speak(`Opening ${appName || 'app'}`);
    } else if (command.includes('play music') || command.includes('play song')) {
      action = '🎵 Playing music';
      speak('Playing music');
    } else if (command.includes('pause music') || command.includes('stop music')) {
      action = '⏸️ Pausing music';
      speak('Pausing music');
    } else if (command.includes('next song') || command.includes('skip')) {
      action = '⏭️ Next song';
      speak('Playing next song');
    } else if (command.includes('previous song') || command.includes('go back')) {
      action = '⏮️ Previous song';
      speak('Playing previous song');
    } else if (command.includes('lock phone') || command.includes('lock screen')) {
      action = '🔒 Locking phone';
      speak('Locking phone');
    } else if (command.includes('airplane mode on') || command.includes('enable airplane mode')) {
      action = '✈️ Enabling airplane mode';
      speak('Enabling airplane mode');
    } else if (command.includes('airplane mode off') || command.includes('disable airplane mode')) {
      action = '📡 Disabling airplane mode';
      speak('Disabling airplane mode');
    } else if (command.includes('battery') || command.includes('charge')) {
      action = '🔋 Checking battery status';
      speak('Battery is at 75 percent');
    } else if (command.includes('time') || command.includes('what time')) {
      const currentTime = new Date().toLocaleTimeString();
      action = `⏰ Current time: ${currentTime}`;
      speak(`The time is ${currentTime}`);
    } else if (command.includes('date') || command.includes('what date')) {
      const currentDate = new Date().toLocaleDateString();
      action = `📅 Current date: ${currentDate}`;
      speak(`Today is ${currentDate}`);
    } else if (command.includes('alarm') && command.includes('set')) {
      action = '⏰ Setting alarm';
      speak('Setting alarm');
    } else if (command.includes('timer')) {
      action = '⏲️ Starting timer';
      speak('Starting timer');
    } else if (command.includes('reminder')) {
      action = '🔔 Creating reminder';
      speak('Creating reminder');
    } else if (command.includes('search') || command.includes('look up')) {
      const query = command.replace(/search|look up|for/gi, '').trim();
      action = `🔍 Searching for: ${query}`;
      speak(`Searching for ${query}`);
    } else if (command.includes('weather')) {
      action = '🌤️ Checking weather';
      speak('The weather is sunny and 72 degrees');
    } else if (command.includes('navigate') || command.includes('directions')) {
      const destination = command.replace(/navigate|directions|to/gi, '').trim();
      action = `🗺️ Getting directions to ${destination}`;
      speak(`Getting directions to ${destination}`);
    } else if (command.includes('screenshot')) {
      action = '📷 Taking screenshot';
      speak('Taking screenshot');
    } else if (command.includes('home') || command.includes('home screen')) {
      action = '🏠 Going to home screen';
      speak('Going to home screen');
    } else if (command.includes('back')) {
      action = '⬅️ Going back';
      speak('Going back');
    } else if (command.includes('recent apps') || command.includes('recent applications')) {
      action = '📋 Opening recent apps';
      speak('Opening recent apps');
    } else if (command.includes('settings')) {
      action = '⚙️ Opening settings';
      speak('Opening settings');
    } else if (command.includes('contacts')) {
      action = '👥 Opening contacts';
      speak('Opening contacts');
    } else if (command.includes('calculator')) {
      action = '🔢 Opening calculator';
      speak('Opening calculator');
    } else if (command.includes('calendar')) {
      action = '📆 Opening calendar';
      speak('Opening calendar');
    } else if (command.includes('email') || command.includes('mail')) {
      action = '📧 Opening email';
      speak('Opening email');
    } else if (command.includes('notes')) {
      action = '📝 Opening notes';
      speak('Opening notes');
    } else if (command.includes('maps')) {
      action = '🗺️ Opening maps';
      speak('Opening maps');
    } else if (command.includes('browser') || command.includes('internet')) {
      action = '🌐 Opening browser';
      speak('Opening browser');
    } else if (command.includes('gallery') || command.includes('photos')) {
      action = '🖼️ Opening gallery';
      speak('Opening gallery');
    } else if (command.includes('help')) {
      action = '❓ Available commands displayed below';
      speak('You can say call, text, volume up, volume down, mute, brightness, wifi, bluetooth, camera, flashlight, play music, lock phone, and many more');
    } else {
      action = `❓ Unknown command: "${command}"`;
      speak('Sorry, I did not understand that command');
    }

    setLastAction(action);
    setCommands(prev => [...prev, { command, action, timestamp: new Date() }]);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      setTranscript('');
    }
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Browser Not Supported</h1>
          <p className="text-gray-600">
            Your browser does not support speech recognition. Please use Chrome, Edge, or Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📱 Voice Phone Assistant</h1>
          <p className="text-gray-600">Control your phone with voice commands</p>
        </div>

        {/* Microphone Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={toggleListening}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center text-6xl transition-all transform hover:scale-105 ${
              isListening
                ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse'
                : 'bg-blue-500 shadow-lg shadow-blue-500/50'
            }`}
          >
            {isListening ? '🎤' : '🎙️'}
          </button>
        </div>

        {/* Status */}
        <div className="text-center mb-6">
          <p className={`text-xl font-semibold ${isListening ? 'text-red-500' : 'text-gray-600'}`}>
            {isListening ? 'Listening...' : 'Click microphone to start'}
          </p>
        </div>

        {/* Live Transcript */}
        {transcript && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-blue-800 text-center">
              <span className="font-semibold">You said:</span> {transcript}
            </p>
          </div>
        )}

        {/* Last Action */}
        {lastAction && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-800 text-center text-lg font-semibold">{lastAction}</p>
          </div>
        )}

        {/* Command History */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📜 Command History</h2>
          <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
            {commands.length === 0 ? (
              <p className="text-gray-500 text-center">No commands yet. Try saying something!</p>
            ) : (
              <div className="space-y-3">
                {commands.slice().reverse().map((cmd, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-semibold text-gray-700">"{cmd.command}"</p>
                      <p className="text-xs text-gray-400">{cmd.timestamp.toLocaleTimeString()}</p>
                    </div>
                    <p className="text-sm text-gray-600">{cmd.action}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sample Commands */}
        <div className="mt-6 bg-purple-50 rounded-xl p-4">
          <h3 className="text-lg font-bold text-purple-800 mb-3">💡 Try These Commands:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div className="bg-white rounded-lg p-2 text-gray-700">"Call John"</div>
            <div className="bg-white rounded-lg p-2 text-gray-700">"Text Mom"</div>
            <div className="bg-white rounded-lg p-2 text-gray-700">"Volume up"</div>
            <div className="bg-white rounded-lg p-2 text-gray-700">"Mute phone"</div>
            <div className="bg-white rounded-lg p-2 text-gray-700">"Turn on WiFi"</div>
            <div className="bg-white rounded-lg p-2 text-gray-700">"Open camera"</div>
            <div className="bg-white rounded-lg p-2 text-gray-700">"Play music"</div>
            <div className="bg-white rounded-lg p-2 text-gray-700">"Flashlight on"</div>
            <div className="bg-white rounded-lg p-2 text-gray-700">"Take screenshot"</div>
            <div className="bg-white rounded-lg p-2 text-gray-700">"What time is it"</div>
            <div className="bg-white rounded-lg p-2 text-gray-700">"Check weather"</div>
            <div className="bg-white rounded-lg p-2 text-gray-700">"Open settings"</div>
          </div>
        </div>
      </div>
    </div>
  );
}
