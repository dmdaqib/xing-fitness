import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Dumbbell,
  Clock,
  Repeat,
  Sparkles,
  UserCheck
} from 'lucide-react';


export const MemberWorkoutsPage: React.FC = () => {
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setIsLoading(true);
      const plan = await api.getWorkouts();
      setWorkoutPlan(plan);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin mb-3" />
        <p className="text-xs uppercase tracking-widest text-[#A1A1AA]">
          Loading Assigned Workout Plan...
        </p>
      </div>
    );
  }

  if (!workoutPlan) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-black uppercase text-white font-display">
          My Workout Plan
        </h1>
        <div className="rounded-3xl bg-[#12141A] border border-white/10 p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-[#D4AF37] flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black uppercase text-white mb-2">
            No Prescription Plan Assigned Yet
          </h3>
          <p className="text-xs text-[#A1A1AA] max-w-md mx-auto mb-6">
            In accordance with Xing Fitness standards, personalized workout splits are assigned directly by our certified coaching team after an initial biomechanical assessment.
          </p>
          <a
            href="/member/trainers"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all"
          >
            <UserCheck className="w-4 h-4" />
            <span>Schedule Assessment with Coach</span>
          </a>
        </div>
      </div>
    );
  }

  const activeDay = workoutPlan.days?.[activeDayIndex] || workoutPlan.days?.[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Plan Header */}
      <div className="rounded-3xl bg-[#12141A] border border-white/10 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-[#D4AF37]">
                Assigned Split
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-[#D4AF37]">
                {workoutPlan.experienceLevel} Level
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black uppercase text-white font-display">
              {workoutPlan.title}
            </h1>
            <p className="text-xs text-[#A1A1AA] mt-1">
              Program Goal: <span className="text-white font-semibold">{workoutPlan.goal}</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-right">
            <span className="text-[10px] uppercase font-bold text-[#A1A1AA] block">
              Prescribed By
            </span>
            <span className="font-bold text-[#D4AF37] text-sm block">
              {workoutPlan.assignedByTrainerName}
            </span>
          </div>
        </div>

        {/* Trainer Coaching Cues */}
        {workoutPlan.trainerNotes && (
          <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3 text-xs">
            <Sparkles className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white uppercase text-[11px]">Coach Directives:</p>
              <p className="text-[#A1A1AA] mt-0.5 leading-relaxed">{workoutPlan.trainerNotes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Day Tabs */}
      <div>
        <div className="flex overflow-x-auto gap-2 pb-2">
          {workoutPlan.days?.map((day: any, idx: number) => {
            const isActive = activeDayIndex === idx;
            return (
              <button
                key={day.id}
                onClick={() => setActiveDayIndex(idx)}
                className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10 font-bold'
                    : 'bg-[#12141A] text-white/70 border border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                {day.dayName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exercise Routine Cards */}
      {activeDay && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase text-white font-display">
              {activeDay.dayName} • <span className="text-[#D4AF37]">{activeDay.targetGoal}</span>
            </h3>
            <span className="text-xs text-[#A1A1AA]">
              {activeDay.exercises?.length || 0} Prescribed Exercises
            </span>
          </div>

          <div className="space-y-3">
            {activeDay.exercises?.map((ex: any, idx: number) => (
              <div
                key={ex.id || idx}
                className="bg-[#12141A] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-[#D4AF37] font-black text-sm flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{ex.name}</h4>
                    <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] text-[#D4AF37] font-semibold">
                      Target: {ex.targetMuscle}
                    </span>
                    {ex.notes && (
                      <p className="text-xs text-[#A1A1AA] mt-1.5 italic">
                        Form cue: "{ex.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 self-start md:self-auto">
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-[#A1A1AA] block">
                      Sets
                    </span>
                    <span className="font-black text-white text-sm">{ex.sets}</span>
                  </div>

                  <div className="h-6 w-px bg-white/10" />

                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-[#A1A1AA] block flex items-center gap-1 justify-center">
                      <Repeat className="w-3 h-3 text-[#D4AF37]" /> Reps
                    </span>
                    <span className="font-black text-white text-sm">{ex.reps}</span>
                  </div>

                  <div className="h-6 w-px bg-white/10" />

                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-[#A1A1AA] block flex items-center gap-1 justify-center">
                      <Clock className="w-3 h-3 text-[#D4AF37]" /> Rest
                    </span>
                    <span className="font-black text-white text-sm">{ex.restSeconds}s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
