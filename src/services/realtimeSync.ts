import { SurveyResponse, FirebaseSettings } from '../types';
import { SAMPLE_RESPONSES, EVALUATION_QUESTIONS } from '../data/questions';

const LOCAL_STORAGE_DATA_KEY = 'training_survey_responses_v1';
const LOCAL_STORAGE_DEVICE_SUBMIT_KEY = 'training_survey_device_submitted_v1';
const LOCAL_STORAGE_FIREBASE_CONFIG_KEY = 'training_survey_firebase_config_v1';

type Listener = (responses: SurveyResponse[]) => void;

class RealtimeSyncManager {
  private responses: SurveyResponse[] = [];
  private listeners: Set<Listener> = new Set();
  private channel: BroadcastChannel | null = null;
  private eventSource: EventSource | null = null;
  private firebaseConfig: FirebaseSettings = {
    apiKey: '',
    databaseURL: '',
    enabled: false
  };

  constructor() {
    this.init();
  }

  private init() {
    // 1. Load from localStorage
    try {
      const savedConfig = localStorage.getItem(LOCAL_STORAGE_FIREBASE_CONFIG_KEY);
      if (savedConfig) {
        this.firebaseConfig = JSON.parse(savedConfig);
      }
    } catch {
      // ignore
    }

    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_DATA_KEY);
      if (savedData) {
        this.responses = JSON.parse(savedData);
      } else {
        // Initial sample seed data for instant presentation view
        this.responses = [...SAMPLE_RESPONSES];
        localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(this.responses));
      }
    } catch {
      this.responses = [...SAMPLE_RESPONSES];
    }

    // 2. Setup BroadcastChannel for zero-latency multi-tab sync
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('training_survey_broadcast');
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'SYNC_RESPONSES' && Array.isArray(event.data.payload)) {
            this.responses = event.data.payload;
            this.notify();
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel initialization error', err);
      }
    }

    // 3. Fallback storage event listener for cross-tab sync
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === LOCAL_STORAGE_DATA_KEY && e.newValue) {
          try {
            this.responses = JSON.parse(e.newValue);
            this.notify();
          } catch {
            // ignore
          }
        }
      });
    }

    // 4. Setup Firebase Realtime Database if configured
    if (this.firebaseConfig.enabled && this.firebaseConfig.databaseURL) {
      this.connectFirebaseStream();
    }
  }

  public getResponses(): SurveyResponse[] {
    return [...this.responses];
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener([...this.responses]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const copy = [...this.responses];
    this.listeners.forEach((listener) => {
      try {
        listener(copy);
      } catch (err) {
        console.error('Error notifying survey listener', err);
      }
    });
  }

  /**
   * บันทึกคำตอบแบบสอบถามใหม่
   */
  public async submitResponse(response: Omit<SurveyResponse, 'id' | 'timestamp' | 'submittedAtFormatted'>): Promise<SurveyResponse> {
    const newEntry: SurveyResponse = {
      ...response,
      id: 'resp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
      submittedAtFormatted: 'เมื่อสักครู่'
    };

    // Update in-memory & localStorage
    this.responses = [newEntry, ...this.responses];
    try {
      localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(this.responses));
    } catch {
      // ignore
    }

    // Mark current device as submitted
    this.markDeviceSubmitted(newEntry.id);

    // Broadcast to other tabs immediately
    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'SYNC_RESPONSES',
          payload: this.responses
        });
      } catch {
        // ignore
      }
    }

    this.notify();

    // If Firebase Realtime Database is enabled, post to Firebase REST endpoint
    if (this.firebaseConfig.enabled && this.firebaseConfig.databaseURL) {
      try {
        const cleanUrl = this.firebaseConfig.databaseURL.replace(/\/+$/, '');
        await fetch(`${cleanUrl}/responses.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEntry)
        });
      } catch (err) {
        console.warn('Firebase RTDB POST error', err);
      }
    }

    return newEntry;
  }

  /**
   * เพิ่มข้อมูลตัวอย่างสำหรับทดสอบการนำเสนอบนจอ
   */
  public addDemoResponse(ratings?: Record<string, number>, feedbackText?: string) {
    const demoAnswers = ratings || {
      q1: Math.floor(Math.random() * 2) + 4, // 4-5
      q2: 5,
      q3: Math.floor(Math.random() * 2) + 4,
      q4: Math.floor(Math.random() * 2) + 4,
      q5: 5
    };

    const feedbacks = [
      'วิทยากรให้ข้อมูลครอบคลุมและยกตัวอย่างเข้าใจง่ายมากครับ',
      'ชอบ Workshop และการแลกเปลี่ยนความรู้ในห้อง ประทับใจมากค่ะ',
      'ได้ทักษะและเครื่องมือใหม่ๆ ไปปรับใช้กับการทำงานจริงทันที',
      'การจัดสรรเวลาดีมาก อาหารและสถานที่สะดวกสบาย',
      'อยากให้จัดหลักสูตรระดับสูง (Advanced) เพิ่มเติมในรุ่นถัดไปครับ'
    ];

    const randomFeedback = feedbackText !== undefined ? feedbackText : feedbacks[Math.floor(Math.random() * feedbacks.length)];

    const entry: SurveyResponse = {
      id: 'demo-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      answers: demoAnswers,
      feedback: randomFeedback,
      timestamp: Date.now(),
      submittedAtFormatted: 'เมื่อสักครู่',
      deviceId: 'demo-simulated'
    };

    this.responses = [entry, ...this.responses];
    localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(this.responses));

    if (this.channel) {
      this.channel.postMessage({
        type: 'SYNC_RESPONSES',
        payload: this.responses
      });
    }

    this.notify();
  }

  /**
   * รีเซ็ตข้อมูลทั้งหมด (สำหรับเริ่มรอบการอบรมใหม่)
   */
  public resetAllResponses() {
    this.responses = [];
    localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(this.responses));
    this.clearDeviceSubmission();

    if (this.channel) {
      this.channel.postMessage({
        type: 'SYNC_RESPONSES',
        payload: this.responses
      });
    }

    this.notify();
  }

  /**
   * โหลดข้อมูลตัวอย่าง 5 รายการ
   */
  public loadSampleResponses() {
    this.responses = [...SAMPLE_RESPONSES];
    localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(this.responses));
    if (this.channel) {
      this.channel.postMessage({
        type: 'SYNC_RESPONSES',
        payload: this.responses
      });
    }
    this.notify();
  }

  // Device Duplicate Prevention
  public hasDeviceSubmitted(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(LOCAL_STORAGE_DEVICE_SUBMIT_KEY);
  }

  public getDeviceSubmissionId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(LOCAL_STORAGE_DEVICE_SUBMIT_KEY);
  }

  public markDeviceSubmitted(responseId: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_DEVICE_SUBMIT_KEY, responseId);
    }
  }

  public clearDeviceSubmission() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_DEVICE_SUBMIT_KEY);
    }
  }

  // Firebase Realtime Database SSE sync
  private connectFirebaseStream() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    if (!this.firebaseConfig.enabled || !this.firebaseConfig.databaseURL) {
      return;
    }

    try {
      const cleanUrl = this.firebaseConfig.databaseURL.replace(/\/+$/, '');
      const sseUrl = `${cleanUrl}/responses.json`;

      this.eventSource = new EventSource(sseUrl);

      this.eventSource.addEventListener('put', (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data && data.data) {
            // Can be object map or individual items
            const parsedList: SurveyResponse[] = [];
            const obj = data.data;
            if (typeof obj === 'object') {
              Object.keys(obj).forEach((key) => {
                const item = obj[key];
                if (item && item.answers) {
                  parsedList.push({
                    id: item.id || key,
                    answers: item.answers,
                    feedback: item.feedback,
                    timestamp: item.timestamp || Date.now(),
                    submittedAtFormatted: item.submittedAtFormatted || 'เมื่อสักครู่',
                    deviceId: item.deviceId
                  });
                }
              });
              if (parsedList.length > 0) {
                // Merge with local responses avoiding duplicate IDs
                const existingMap = new Map<string, SurveyResponse>();
                [...parsedList, ...this.responses].forEach(item => existingMap.set(item.id, item));
                this.responses = Array.from(existingMap.values()).sort((a, b) => b.timestamp - a.timestamp);
                localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(this.responses));
                this.notify();
              }
            }
          }
        } catch (err) {
          console.warn('Firebase RTDB event parse error', err);
        }
      });

      this.eventSource.onerror = (err) => {
        console.warn('Firebase RTDB SSE stream error (will retry or fallback to local)', err);
      };
    } catch (err) {
      console.warn('Could not establish Firebase SSE stream', err);
    }
  }

  public updateFirebaseConfig(config: FirebaseSettings) {
    this.firebaseConfig = config;
    try {
      localStorage.setItem(LOCAL_STORAGE_FIREBASE_CONFIG_KEY, JSON.stringify(config));
    } catch {
      // ignore
    }

    if (config.enabled && config.databaseURL) {
      this.connectFirebaseStream();
    } else if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  public getFirebaseConfig(): FirebaseSettings {
    return { ...this.firebaseConfig };
  }
}

export const realtimeSync = new RealtimeSyncManager();

/**
 * ดาวน์โหลดข้อมูลเป็นไฟล์ CSV (รองรับภาษาไทยด้วย UTF-8 BOM สำหรับเปิดใน MS Excel ไม่เป็นภาษาต่างดาว)
 */
export function exportToCSV(responses: SurveyResponse[]) {
  // UTF-8 BOM: \uFEFF
  const BOM = '\uFEFF';

  const headers = [
    'ลำดับ',
    'รหัสการตอบ',
    'วันเวลาที่ส่ง',
    ...EVALUATION_QUESTIONS.map(q => `ข้อ ${q.order}: ${q.shortLabel}`),
    'คะแนนเฉลี่ยรวม',
    'ข้อเสนอแนะเพิ่มเติม'
  ];

  const rows = responses.map((r, index) => {
    const scores = EVALUATION_QUESTIONS.map(q => r.answers[q.id] || '');
    const validScores = scores.filter(s => typeof s === 'number') as number[];
    const mean = validScores.length > 0 ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(2) : '0.00';
    const dateFormatted = new Date(r.timestamp).toLocaleString('th-TH');

    // Escape feedback text for CSV (quote and double escape internal quotes)
    const escapedFeedback = r.feedback ? `"${r.feedback.replace(/"/g, '""')}"` : '""';

    return [
      index + 1,
      r.id,
      `"${dateFormatted}"`,
      ...scores,
      mean,
      escapedFeedback
    ].join(',');
  });

  const csvContent = BOM + [headers.join(','), ...rows].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  link.setAttribute('href', url);
  link.setAttribute('download', `แบบประเมินความพึงพอใจการอบรม_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
