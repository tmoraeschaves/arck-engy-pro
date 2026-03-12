import React, { useState } from 'react';
import { BookOpen, AlertCircle, Lightbulb, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const MentorPanel = ({ lessons = [] }) => {
  const [expandedLesson, setExpandedLesson] = useState(null);

  if (!lessons || lessons.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
        <h3 className="text-sm font-bold text-slate-400">Arquitetura Saudável</h3>
        <p className="text-xs text-slate-600 mt-1">
          Nenhum problema detectado.
        </p>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
      <div className="bg-slate-800/50 p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold uppercase">ARCK Mentor ({lessons.length})</h2>
        </div>
      </div>

      <div className="divide-y divide-slate-800 max-h-[500px] overflow-y-auto">
        {lessons.map((item, index) => {
          const lesson = item.lesson || item;
          const isExpanded = expandedLesson === lesson.id;

          return (
            <div key={lesson.id || index} className="p-4 hover:bg-slate-800/30">
              <div 
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}
              >
                <div className={`mt-1 ${getSeverityColor(lesson.severity)}`}>
                  {getSeverityIcon(lesson.severity)}
                </div>
                
                <div className="flex-1">
                  <h3 className={`text-sm font-bold ${getSeverityColor(lesson.severity)}`}>
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {lesson.explanation}
                  </p>
                </div>
                
                <div className="text-slate-600">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 ml-8 space-y-4">
                  {lesson.whyItMatters && (
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <h4 className="text-[10px] uppercase text-slate-500 mb-2">POR QUE IMPORTA</h4>
                      <p className="text-xs text-slate-300">{lesson.whyItMatters}</p>
                    </div>
                  )}

                  {lesson.recommendation && (
                    <div className="bg-cyan-950/30 border border-cyan-800/30 rounded-lg p-3">
                      <h4 className="text-[10px] uppercase text-cyan-400 mb-2">RECOMENDAÇÃO</h4>
                      <p className="text-xs text-slate-300 mb-2">{lesson.recommendation.description}</p>
                      
                      {lesson.recommendation.steps && (
                        <ol className="space-y-1 mt-2">
                          {lesson.recommendation.steps.map((step, i) => (
                            <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                              <span className="text-cyan-400 font-bold">{i + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}; 
