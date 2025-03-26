import { useState, useRef } from 'react';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, ...args: any[]) => void;
      };
    };
  }
}

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      // Request microphone access
      // const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 2, // stereo
          sampleRate: 48000,
          sampleSize: 16
        }
      });
      const recorder = new MediaRecorder(stream);

      // Resets chunks at start of new recording
      chunksRef.current = [];

      // Pushes new data to chunks array
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          console.log('Data available:', chunksRef.current.length, 'bytes');
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();

        // Send recording through ipc
        reader.onload = () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          const fileName = `recording-${Date.now()}.webm`;
          console.log('Sending recording to main process:', fileName);
          window.electron.ipcRenderer.send('save-recording', arrayBuffer, fileName);
        };

        reader.readAsArrayBuffer(blob);
        stream.getTracks().forEach(track => track.stop());
        chunksRef.current = [];
      };

      // Set to deliver data every 100ms
      recorder.start(100);
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
}
