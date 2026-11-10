import { Question, Interpretation, SurveyResponse, SurveySummary, QuestionStat } from '../types';

export const EVALUATION_QUESTIONS: Question[] = [
  {
    id: 'q1',
    order: 1,
    text: 'เนื้อหาและหลักสูตรตรงกับความต้องการและนำไปประยุกต์ใช้ได้จริง',
    shortLabel: 'เนื้อหาและหลักสูตร',
    category: 'ด้านเนื้อหา'
  },
  {
    id: 'q2',
    order: 2,
    text: 'วิทยากรมีความรู้ความสามารถและเทคนิคการถ่ายทอดที่เข้าใจง่าย',
    shortLabel: 'วิทยากรและการถ่ายทอด',
    category: 'ด้านวิทยากร'
  },
  {
    id: 'q3',
    order: 3,
    text: 'การจัดสรรเวลาและการมีส่วนร่วมในกิจกรรมมีความเหมาะสม',
    shortLabel: 'เวลาและกิจกรรม',
    category: 'ด้านกระบวนการ'
  },
  {
    id: 'q4',
    order: 4,
    text: 'สื่อ เอกสารประกอบ และสถานที่/ระบบการอบรมมีคุณภาพ',
    shortLabel: 'สื่อและระบบการอบรม',
    category: 'ด้านสิ่งอำนวยความสะดวก'
  },
  {
    id: 'q5',
    order: 5,
    text: 'ความพึงพอใจในภาพรวมต่อการจัดอบรมครั้งนี้',
    shortLabel: 'ความพึงพอใจภาพรวม',
    category: 'ภาพรวม'
  }
];

export const RATING_SCALE = [
  { score: 1, label: 'น้อยที่สุด', emoji: '😞', color: 'text-rose-600', activeBg: 'bg-rose-500 text-white' },
  { score: 2, label: 'น้อย', emoji: '🙁', color: 'text-amber-600', activeBg: 'bg-amber-500 text-white' },
  { score: 3, label: 'ปานกลาง', emoji: '😐', color: 'text-yellow-600', activeBg: 'bg-yellow-500 text-white' },
  { score: 4, label: 'มาก', emoji: '😊', color: 'text-emerald-600', activeBg: 'bg-emerald-500 text-white' },
  { score: 5, label: 'มากที่สุด', emoji: '🤩', color: 'text-indigo-600', activeBg: 'bg-indigo-600 text-white' },
];

/**
 * เกณฑ์การแปลผลคะแนนเฉลี่ย 5 ระดับ (เกณฑ์มาตรฐานตามแบบแผนวิจัยทางการศึกษา):
 * 4.51 – 5.00 : มากที่สุด (Excellent)
 * 3.51 – 4.50 : มาก (Good)
 * 2.51 – 3.50 : ปานกลาง (Moderate)
 * 1.51 – 2.50 : น้อย (Poor)
 * 1.00 – 1.50 : น้อยที่สุด (Needs Improvement)
 */
export function getInterpretation(mean: number): Interpretation {
  if (mean >= 4.51) {
    return {
      level: 5,
      label: 'มากที่สุด',
      color: '#4f46e5',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      textColor: 'text-indigo-700 dark:text-indigo-300',
      description: 'ระดับความพึงพอใจดีเยี่ยม เกินความคาดหมายของผู้เข้าอบรม'
    };
  } else if (mean >= 3.51) {
    return {
      level: 4,
      label: 'มาก',
      color: '#10b981',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      description: 'ระดับความพึงพอใจอยู่ในเกณฑ์ดี บรรลุตามวัตถุประสงค์'
    };
  } else if (mean >= 2.51) {
    return {
      level: 3,
      label: 'ปานกลาง',
      color: '#f59e0b',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-200 dark:border-amber-800',
      textColor: 'text-amber-700 dark:text-amber-300',
      description: 'ระดับความพึงพอใจปานกลาง ควรพัฒนาต่อยอดในบางจุด'
    };
  } else if (mean >= 1.51) {
    return {
      level: 2,
      label: 'น้อย',
      color: '#f97316',
      bgColor: 'bg-orange-50 dark:bg-orange-950/40',
      borderColor: 'border-orange-200 dark:border-orange-800',
      textColor: 'text-orange-700 dark:text-orange-300',
      description: 'ระดับความพึงพอใจน้อย จำเป็นต้องปรับปรุงประเด็นสำคัญ'
    };
  } else {
    return {
      level: 1,
      label: 'น้อยที่สุด',
      color: '#ef4444',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      borderColor: 'border-rose-200 dark:border-rose-800',
      textColor: 'text-rose-700 dark:text-rose-300',
      description: 'ระดับความพึงพอใจต่ำสุด ต้องทบทวนกระบวนการและเนื้อหา'
    };
  }
}

/**
 * คำนวณสถิติค่าเฉลี่ย (Mean) และส่วนเบี่ยงเบนมาตรฐาน (S.D.)
 */
export function calculateStats(responses: SurveyResponse[]): SurveySummary {
  const totalResponses = responses.length;

  if (totalResponses === 0) {
    const emptyBreakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    return {
      totalResponses: 0,
      overallMean: 0,
      overallSD: 0,
      overallInterpretation: {
        level: 0,
        label: 'รอข้อมูล',
        color: '#94a3b8',
        bgColor: 'bg-slate-100 dark:bg-slate-800',
        borderColor: 'border-slate-300 dark:border-slate-700',
        textColor: 'text-slate-600 dark:text-slate-400',
        description: 'ยังไม่มีผู้ตอบแบบประเมิน กำลังรอรับข้อมูล'
      },
      questions: EVALUATION_QUESTIONS.map(q => ({
        id: q.id,
        order: q.order,
        text: q.text,
        shortLabel: q.shortLabel,
        category: q.category,
        mean: 0,
        sd: 0,
        distribution: { ...emptyBreakdown },
        percentages: { ...emptyBreakdown },
        interpretation: {
          level: 0,
          label: 'รอข้อมูล',
          color: '#94a3b8',
          bgColor: 'bg-slate-100 dark:bg-slate-800',
          borderColor: 'border-slate-300 dark:border-slate-700',
          textColor: 'text-slate-600 dark:text-slate-400',
          description: 'ยังไม่มีข้อมูล'
        }
      })),
      scoreBreakdown: { ...emptyBreakdown },
      scorePercentages: { ...emptyBreakdown },
      latestFeedback: []
    };
  }

  // คำนวณรายข้อ
  let totalAllScores = 0;
  let countAllScores = 0;
  const overallScoresList: number[] = [];
  const globalScoreBreakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  const questionStats: QuestionStat[] = EVALUATION_QUESTIONS.map(q => {
    const scores: number[] = [];
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    responses.forEach(r => {
      const val = r.answers[q.id];
      if (typeof val === 'number' && val >= 1 && val <= 5) {
        scores.push(val);
        distribution[val] = (distribution[val] || 0) + 1;
        globalScoreBreakdown[val] = (globalScoreBreakdown[val] || 0) + 1;
        totalAllScores += val;
        countAllScores++;
        overallScoresList.push(val);
      }
    });

    const sum = scores.reduce((acc, curr) => acc + curr, 0);
    const mean = scores.length > 0 ? Number((sum / scores.length).toFixed(2)) : 0;

    // S.D. formula
    let sd = 0;
    if (scores.length > 1) {
      const variance = scores.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / (scores.length - 1);
      sd = Number(Math.sqrt(variance).toFixed(2));
    }

    const percentages: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (scores.length > 0) {
      for (let s = 1; s <= 5; s++) {
        percentages[s] = Number(((distribution[s] / scores.length) * 100).toFixed(1));
      }
    }

    return {
      id: q.id,
      order: q.order,
      text: q.text,
      shortLabel: q.shortLabel,
      category: q.category,
      mean,
      sd,
      distribution,
      percentages,
      interpretation: getInterpretation(mean)
    };
  });

  // ค่าเฉลี่ยรวมทุกข้อ
  const overallMean = countAllScores > 0 ? Number((totalAllScores / countAllScores).toFixed(2)) : 0;
  let overallSD = 0;
  if (overallScoresList.length > 1) {
    const variance = overallScoresList.reduce((acc, curr) => acc + Math.pow(curr - overallMean, 2), 0) / (overallScoresList.length - 1);
    overallSD = Number(Math.sqrt(variance).toFixed(2));
  }

  const scorePercentages: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  if (countAllScores > 0) {
    for (let s = 1; s <= 5; s++) {
      scorePercentages[s] = Number(((globalScoreBreakdown[s] / countAllScores) * 100).toFixed(1));
    }
  }

  // ข้อเสนอแนะล่าสุด (กรองเฉพาะที่มีข้อความ)
  const latestFeedback = responses
    .filter(r => r.feedback && r.feedback.trim().length > 0)
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(r => {
      const values = Object.values(r.answers);
      const avg = values.length > 0 ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)) : 0;
      return {
        id: r.id,
        text: r.feedback!.trim(),
        timestamp: r.timestamp,
        averageScore: avg,
        answers: r.answers
      };
    });

  return {
    totalResponses,
    overallMean,
    overallSD,
    overallInterpretation: getInterpretation(overallMean),
    questions: questionStats,
    scoreBreakdown: globalScoreBreakdown,
    scorePercentages,
    latestFeedback
  };
}

export const SAMPLE_RESPONSES: SurveyResponse[] = [
  {
    id: 'resp-1',
    answers: { q1: 5, q2: 5, q3: 4, q4: 5, q5: 5 },
    feedback: 'วิทยากรถ่ายทอดได้เข้าใจง่ายมาก มีการยกตัวอย่างและให้ลองปฏิบัติจริง ได้รับประโยชน์เต็มที่ครับ',
    timestamp: Date.now() - 1000 * 60 * 35,
    submittedAtFormatted: '35 นาทีที่แล้ว',
    deviceId: 'sample-device-1'
  },
  {
    id: 'resp-2',
    answers: { q1: 5, q2: 5, q3: 5, q4: 4, q5: 5 },
    feedback: 'เนื้อหาอัปเดตทันสมัย เอกสารประกอบดีเยี่ยม อยากให้มีหลักสูตรขั้นสูง (Advanced) เพิ่มเติมในครั้งต่อไปค่ะ',
    timestamp: Date.now() - 1000 * 60 * 20,
    submittedAtFormatted: '20 นาทีที่แล้ว',
    deviceId: 'sample-device-2'
  },
  {
    id: 'resp-3',
    answers: { q1: 4, q2: 5, q3: 4, q4: 4, q5: 4 },
    feedback: 'ระบบและสัญญาณอินเทอร์เน็ตในห้องราบรื่น การจัดเวลาเหมาะสมดีมากครับ',
    timestamp: Date.now() - 1000 * 60 * 12,
    submittedAtFormatted: '12 นาทีที่แล้ว',
    deviceId: 'sample-device-3'
  },
  {
    id: 'resp-4',
    answers: { q1: 5, q2: 4, q3: 4, q4: 5, q5: 5 },
    feedback: 'ชอบกิจกรรม Workshop กลุ่ม ได้แลกเปลี่ยนมุมมองกับเพื่อนร่วมงานจากต่างฝ่ายดีมาก',
    timestamp: Date.now() - 1000 * 60 * 5,
    submittedAtFormatted: '5 นาทีที่แล้ว',
    deviceId: 'sample-device-4'
  },
  {
    id: 'resp-5',
    answers: { q1: 4, q2: 4, q3: 4, q4: 4, q5: 4 },
    feedback: 'บรรยากาศการอบรมเป็นกันเอง มีอาหารว่างและเครื่องดื่มพร้อม ขอบคุณทีมผู้จัดครับ',
    timestamp: Date.now() - 1000 * 60 * 2,
    submittedAtFormatted: '2 นาทีที่แล้ว',
    deviceId: 'sample-device-5'
  }
];
